import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Field, Form, Formik } from 'formik';
import { v4 as createUuid } from 'uuid';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Plus } from 'phosphor-react';
import { EmailNotificationSchema, SmsNotificationSchema } from 'constants/formSchemas';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  notifyEmails: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  setNotifyEmails: PropTypes.func.isRequired,
  notifySms: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  setNotifySms: PropTypes.func.isRequired,
};

const NotifyForms = ({ isOpen, notifyEmails, setNotifyEmails, notifySms, setNotifySms }) => {
  const { t } = useTranslation();

  return (
    <>
      <Formik
        key={isOpen ? createUuid() : ''}
        initialValues={{ emailToNotify: '' }}
        validationSchema={() => EmailNotificationSchema(t)}
        onSubmit={({ emailToNotify }, { resetForm }) => {
          setNotifyEmails((value) => [...value, emailToNotify]);
          resetForm();
        }}
      >
        {({ errors, touched, isValid, dirty, submitForm }) => (
          <Form>
            <Field name="emailToNotify">
              {({ field }) => (
                <FormControl mt={4} isInvalid={errors.emailToNotify && touched.emailToNotify}>
                  <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                    {t('batch.emails_to_notify')}:
                  </FormLabel>
                  <p>{notifyEmails.map((email, index) => `${index > 0 ? ', ' : ''}${email}`)}</p>
                  <InputGroup>
                    <Input
                      {...field}
                      borderRadius="15px"
                      pt={1}
                      fontSize="sm"
                      type="string"
                      placeholder={t('form.new_email_to_notify')}
                    />
                    <InputRightElement>
                      {' '}
                      <IconButton
                        icon={<Plus />}
                        type="submit"
                        isDisabled={!isValid || !dirty}
                        onClick={submitForm}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.emailToNotify}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Form>
        )}
      </Formik>
      <Formik
        key={isOpen ? createUuid() : ''}
        initialValues={{ phone: '' }}
        validationSchema={() => SmsNotificationSchema(t)}
        onSubmit={({ phone }, { resetForm }) => {
          setNotifySms((value) => [...value, phone[0] === '+' ? phone : `+${phone}`]);
          resetForm();
        }}
      >
        {({ errors, touched, isValid, dirty, submitForm }) => (
          <Form>
            <Field name="phone">
              {({ field }) => (
                <FormControl mt={4} isInvalid={errors.phone && touched.phone}>
                  <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                    {t('batch.phones_to_notify')}:
                  </FormLabel>
                  <p>{notifySms.map((phone, index) => `${index > 0 ? ', ' : ''}${phone}`)}</p>
                  <InputGroup>
                    <Input
                      {...field}
                      borderRadius="15px"
                      pt={1}
                      fontSize="sm"
                      type="string"
                      placeholder={t('form.new_phone_to_notify')}
                    />
                    <InputRightElement>
                      {' '}
                      <IconButton
                        icon={<Plus />}
                        type="submit"
                        isDisabled={!isValid || !dirty}
                        onClick={submitForm}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Form>
        )}
      </Formik>
    </>
  );
};

NotifyForms.propTypes = propTypes;

export default NotifyForms;
