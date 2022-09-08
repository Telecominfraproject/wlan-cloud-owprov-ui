import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Box, Flex, Link, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { SubscriberSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import useMutationResult from 'hooks/useMutationResult';
import { useCreateSubscriber } from 'hooks/Network/Subscribers';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import useApiRequirements from 'hooks/useApiRequirements';
import ToggleField from 'components/FormFields/ToggleField';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  operatorId: PropTypes.string.isRequired,
};

const CreateSubscriberForm = ({ isOpen, onClose, refresh, formRef, operatorId }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const { passwordPolicyLink, passwordPattern } = useApiRequirements();
  const { onSuccess, onError } = useMutationResult({
    objName: t('subscribers.one'),
    operationType: 'create',
    onClose,
  });

  const create = useCreateSubscriber();

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{ ...SubscriberSchema(t, { needPassword: true }).cast(), emailValidation: true }}
      validationSchema={SubscriberSchema(t, { passRegex: passwordPattern })}
      onSubmit={(data, { setSubmitting, resetForm }) =>
        create.mutateAsync(
          {
            ...data,
            userRole: 'subscriber',
            owner: operatorId,
            notes: data.note.length > 0 ? [{ note: data.note }] : undefined,
          },
          {
            onSuccess: () => {
              onSuccess({ setSubmitting, resetForm });
              refresh();
            },
            onError: (e) => {
              onError(e, { resetForm });
            },
          },
        )
      }
    >
      <Form>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
          <StringField name="email" label={t('common.email')} isRequired />
          <StringField name="name" label={t('common.name')} isRequired />
          <ToggleField name="emailValidation" label={t('users.email_validation')} />
          <StringField name="currentPassword" label={t('user.password')} isRequired hideButton />
          <StringField name="description" label={t('common.description')} />
          <StringField name="note" label={t('common.note')} />
        </SimpleGrid>
        <Flex justifyContent="center" alignItems="center" maxW="100%" mt={4} mb={6}>
          <Box w="100%">
            <Link href={passwordPolicyLink} isExternal>
              {t('login.password_policy')}
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
        </Flex>
      </Form>
    </Formik>
  );
};

CreateSubscriberForm.propTypes = propTypes;

export default CreateSubscriberForm;
