import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { axiosSec } from 'utils/axiosInstances';
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
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { ArrowBackIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Formik, Field, Form } from 'formik';
import { useMutation } from 'react-query';

const ForgotPasswordSchema = Yup.object().shape({
  userId: Yup.string().email('Invalid email').required('Required'),
});

const propTypes = {
  requirements: PropTypes.shape({
    accessPolicy: PropTypes.string.isRequired,
  }),
  setActiveForm: PropTypes.func.isRequired,
};

const defaultProps = {
  requirements: null,
};

const ForgotPasswordForm = ({ requirements, setActiveForm }) => {
  const { t } = useTranslation();
  const titleColor = useColorModeValue('blue.300', 'white');
  const textColor = useColorModeValue('gray.400', 'white');
  const forgotPassword = useMutation(
    (loginInfo) => axiosSec.post('oauth2?forgotPassword=true', loginInfo),
    {
      onError: (e) => e,
    },
  );

  return (
    <>
      <Box display="flex" alignItems="center">
        <Heading color={titleColor} fontSize="32px" mb="10px">
          {t('login.forgot_password_title')}
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
      <Text mb="24px" ms="4px" mt={2} color={textColor} fontWeight="bold" fontSize="14px">
        {t('login.forgot_password_instructions')}
      </Text>
      <Formik
        initialValues={{
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={({ userId }, { setSubmitting }) => {
          forgotPassword.mutateAsync(
            {
              userId,
            },
            {
              onSuccess: () => {
                setSubmitting(false);
              },
              onError: () => setSubmitting(false),
            },
          );
        }}
      >
        {({ isSubmitting, errors, touched, isValid, dirty }) => (
          <Form>
            <Field name="userId">
              {({ field }) => (
                <FormControl isInvalid={errors.userId && touched.userId}>
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
                  <FormErrorMessage>{errors.userId}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            {forgotPassword.isSuccess ? (
              <Alert mt="16px" status="success">
                {t('login.forgot_password_successful')}
              </Alert>
            ) : null}
            {forgotPassword.error ? (
              <Alert mt="16px" status="error">
                {t('common.general_error')}
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
              {t('login.reset_password')}
            </Button>
          </Form>
        )}
      </Formik>
      <Flex justifyContent="center" alignItems="center" maxW="100%" mt="0px">
        <Box w="100%">
          <Link
            href={`https://ucentral.dpaas.arilia.com:16061/${requirements?.accessPolicy}`}
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

ForgotPasswordForm.propTypes = propTypes;
ForgotPasswordForm.defaultProps = defaultProps;

export default ForgotPasswordForm;
