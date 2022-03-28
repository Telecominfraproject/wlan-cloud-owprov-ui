import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { axiosSec, secUrl } from 'utils/axiosInstances';
import {
  Alert,
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Switch,
  Text,
  useColorModeValue,
  Spacer,
  FormErrorMessage,
  Link,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Formik, Field, Form } from 'formik';
import { useMutation } from 'react-query';
import { useAuth } from 'contexts/AuthProvider';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  rememberMe: Yup.bool(),
});

const propTypes = {
  requirements: PropTypes.instanceOf(Object),
  setActiveForm: PropTypes.func.isRequired,
};

const defaultProps = {
  requirements: null,
};

const LoginForm = ({ requirements, setActiveForm }) => {
  const { t } = useTranslation();
  const { setToken } = useAuth();
  const titleColor = useColorModeValue('blue.300', 'white');
  const textColor = useColorModeValue('gray.400', 'white');
  const login = useMutation((loginInfo) => axiosSec.post('oauth2', loginInfo));
  const forgotPassword = () => setActiveForm({ form: 'forgot-password' });

  return (
    <>
      <Heading color={titleColor} fontSize="32px" mb="10px">
        {t('login.welcome_back')}
      </Heading>
      <Text mb="24px" ms="4px" color={textColor} fontWeight="bold" fontSize="14px">
        {t('login.login_explanation')}
      </Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
          rememberMe: false,
        }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          login.mutateAsync(
            { userId: values.email, password: values.password },
            {
              onSuccess: (response) => {
                if (response.data.method && response.data.created) {
                  setActiveForm({
                    form: 'mfa',
                    data: {
                      method: response.data.method,
                      verifUuid: response.data.uuid,
                      userId: values.email,
                      password: values.password,
                    },
                  });
                } else {
                  if (values.rememberMe) localStorage.setItem('access_token', response.data.access_token);
                  else sessionStorage.setItem('access_token', response.data.access_token);
                  setToken(response.data.access_token);
                }
              },
              onError: (e) => {
                if (e?.response?.status === 403 && e.response.data.ErrorCode === 1) {
                  setActiveForm({
                    form: 'change-password',
                    data: { userId: values.email, password: values.password },
                  });
                }
                setSubmitting(false);
              },
            },
          );
        }}
      >
        {({ isSubmitting, errors, touched, isValid, dirty }) => (
          <Form>
            <Field name="email">
              {({ field }) => (
                <FormControl isInvalid={errors.email && touched.email}>
                  <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                    {t('common.email')}
                  </FormLabel>
                  <Input
                    {...field}
                    borderRadius="15px"
                    fontSize="sm"
                    type="text"
                    placeholder={t('login.your_email')}
                    size="lg"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field }) => (
                <FormControl mt="24px" isInvalid={errors.password && touched.password}>
                  <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                    {t('common.password')}
                  </FormLabel>
                  <Input
                    {...field}
                    borderRadius="15px"
                    fontSize="sm"
                    type="password"
                    placeholder={t('login.your_password')}
                    size="lg"
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Flex display={{ base: 'block', sm: 'flex' }} mt="24px">
              <Field name="rememberMe">
                {({ field }) => (
                  <FormControl display="flex" alignItems="center">
                    <Switch {...field} colorScheme="blue" me="10px" />
                    <FormLabel htmlFor="remember-login" mb="0" ms="1" fontWeight="normal">
                      {t('login.remember_me')}
                    </FormLabel>
                  </FormControl>
                )}
              </Field>
              <Button
                colorScheme="gray"
                color={textColor}
                onClick={forgotPassword}
                fontWeight="medium"
                variant="ghost"
                pl={{ base: '0px' }}
              >
                {t('login.forgot_password')}
              </Button>
            </Flex>
            {login.error ? (
              <Alert mt="16px" status="error">
                {t('login.invalid_credentials')}
              </Alert>
            ) : null}
            <Button
              fontSize="15px"
              type="submit"
              bg="blue.300"
              w="100%"
              h="45"
              mb="20px"
              color="white"
              mt="20px"
              _hover={{
                bg: 'blue.500',
              }}
              _active={{
                bg: 'blue.300',
              }}
              isLoading={isSubmitting}
              isDisabled={!isValid || !dirty}
            >
              {t('login.sign_in')}
            </Button>
          </Form>
        )}
      </Formik>
      <Flex justifyContent="center" alignItems="center" maxW="100%" mt="0px">
        <Box w="100%">
          <Link href={`${secUrl}${requirements?.passwordPolicy}`} isExternal textColor={textColor} mr="24px">
            {t('login.password_policy')}
            <ExternalLinkIcon mx="2px" />
          </Link>
          <Link href={`${secUrl}${requirements?.accessPolicy}`} isExternal textColor={textColor}>
            {t('login.access_policy')}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Box>
        <Spacer />
      </Flex>
    </>
  );
};

LoginForm.propTypes = propTypes;

LoginForm.defaultProps = defaultProps;

export default LoginForm;
