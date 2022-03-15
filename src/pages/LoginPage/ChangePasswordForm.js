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
  Text,
  useColorModeValue,
  Spacer,
  FormErrorMessage,
  Link,
  IconButton,
  Tooltip,
  useBoolean,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { ArrowBackIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Formik, Field, Form } from 'formik';
import { useMutation } from 'react-query';
import { useAuth } from 'contexts/AuthProvider';

const LoginSchema = Yup.object().shape({
  newPassword: Yup.string().required('Required'),
  confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

const propTypes = {
  requirements: PropTypes.shape({
    accessPolicy: PropTypes.string.isRequired,
    passwordPolicy: PropTypes.string.isRequired,
  }),
  activeForm: PropTypes.shape({
    form: PropTypes.string.isRequired,
    data: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }),
  }).isRequired,
  setActiveForm: PropTypes.func.isRequired,
};

const defaultProps = {
  requirements: null,
};

const ChangePasswordForm = ({ requirements, activeForm, setActiveForm }) => {
  const { t } = useTranslation();
  const { setToken } = useAuth();
  const [showNew, setShowNew] = useBoolean();
  const [showConfirm, setShowConfirm] = useBoolean();
  const titleColor = useColorModeValue('blue.300', 'white');
  const textColor = useColorModeValue('gray.400', 'white');
  const login = useMutation((loginInfo) => axiosSec.post('oauth2', loginInfo), {
    onSuccess: ({ data }) => {
      localStorage.setItem('access_token', data.access_token);
    },
    onError: (e, data) => {
      // If we need to change password
      if (e?.response?.status === 403 && e.response.data.ErrorCode === 1) {
        setActiveForm({
          form: 'change-password',
          data,
        });
        return null;
      }
      return e;
    },
  });

  return (
    <>
      <Box display="flex" alignItems="center">
        <Heading color={titleColor} fontSize="32px" mb="10px">
          {t('login.change_your_password')}
        </Heading>
        <Spacer />
        <Tooltip hasArrow label={t('common.go_back')} placement="top">
          <IconButton
            size="lg"
            color="white"
            bg="blue.300"
            _hover={{
              bg: 'blue.500',
            }}
            _active={{
              bg: 'blue.300',
            }}
            icon={<ArrowBackIcon h={12} w={12} />}
            onClick={() => setActiveForm({ form: 'login' })}
          />
        </Tooltip>
      </Box>
      <Text mb="24px" ms="4px" color={textColor} fontWeight="bold" fontSize="14px">
        {t('login.change_password_explanation')}
      </Text>
      <Formik
        initialValues={{
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          login.mutateAsync(
            {
              userId: activeForm.data.userId,
              password: activeForm.data.password,
              newPassword: values.newPassword,
            },
            {
              onSuccess: (response) => {
                localStorage.setItem('access_token', response.data.access_token);
                setToken(response.data.access_token);
              },
              onError: () => setSubmitting(false),
            },
          );
        }}
      >
        {({ isSubmitting, errors, touched, isValid, dirty }) => (
          <Form>
            <Field name="newPassword">
              {({ field }) => (
                <FormControl mt="24px" isInvalid={errors.newPassword && touched.newPassword}>
                  <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                    {t('login.new_password')}
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      {...field}
                      pr="4.5rem"
                      borderRadius="15px"
                      fontSize="sm"
                      type={showNew ? 'text' : 'password'}
                      placeholder={t('login.your_new_password')}
                      size="lg"
                    />
                    <InputRightElement pt="0.5rem" width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={setShowNew.toggle}>
                        {showNew ? t('common.hide') : t('common.show')}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="confirmNewPassword">
              {({ field }) => (
                <FormControl
                  mt="24px"
                  isInvalid={errors.confirmNewPassword && touched.confirmNewPassword}
                >
                  <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                    {t('login.confirm_new_password')}
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      {...field}
                      pr="4.5rem"
                      borderRadius="15px"
                      fontSize="sm"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder={t('login.your_new_password')}
                      size="lg"
                    />
                    <InputRightElement pt="0.5rem" width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={setShowConfirm.toggle}>
                        {showConfirm ? t('common.hide') : t('common.show')}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmNewPassword}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
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
              {t('login.change_your_password')}
            </Button>
          </Form>
        )}
      </Formik>
      <Flex justifyContent="center" alignItems="center" maxW="100%" mt="0px">
        <Box w="100%">
          <Link href={`${secUrl}${requirements?.passwordPolicy}`} isExternal textColor={textColor}>
            {t('login.password_policy')}
            <ExternalLinkIcon mx="2px" />
          </Link>
          <Link
            ml="24px"
            href={`${secUrl}${requirements?.accessPolicy}`}
            isExternal
            textColor={textColor}
          >
            {t('login.access_policy')}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Box>
      </Flex>
    </>
  );
};

ChangePasswordForm.propTypes = propTypes;
ChangePasswordForm.defaultProps = defaultProps;

export default ChangePasswordForm;
