import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { OperatorContactSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import MultiPhoneNumberField from 'components/CustomFields/MultiPhoneNumberField';
import { useCreateOperatorContact } from 'hooks/Network/OperatorContacts';
import useMutationResult from 'hooks/useMutationResult';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  operatorId: PropTypes.string.isRequired,
};

const CreateOperatorContactForm = ({ isOpen, onClose, refresh, formRef, operatorId }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const { onSuccess, onError } = useMutationResult({
    objName: t('contacts.one'),
    operationType: 'create',
    refresh,
    onClose,
  });

  const create = useCreateOperatorContact();

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{
        visual: '',
        type: 'SUBSCRIBER',
        salutation: '',
        title: '',
        firstname: '',
        lastname: '',
        initials: '',
        primaryEmail: '',
        secondaryEmail: '',
        mobiles: [],
        phones: [],
        description: '',
        accessPIN: '',
        note: '',
      }}
      validationSchema={OperatorContactSchema(t)}
      onSubmit={(
        {
          name,
          type,
          salutation,
          title,
          firstname,
          lastname,
          initials,
          primaryEmail,
          secondaryEmail,
          mobiles,
          phones,
          description,
          accessPIN,
          note,
        },
        { setSubmitting, resetForm },
      ) =>
        create.mutateAsync(
          {
            name,
            type,
            salutation,
            title,
            firstname,
            lastname,
            initials,
            primaryEmail,
            secondaryEmail,
            mobiles,
            phones,
            description,
            accessPIN,
            operatorId,
            notes: note.length > 0 ? [{ note }] : undefined,
          },
          {
            onSuccess: () => {
              onSuccess(setSubmitting, resetForm);
            },
            onError: (e) => {
              onError(e, { resetForm });
            },
          },
        )
      }
    >
      {({ errors, touched, setFieldValue }) => (
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
            <StringField name="name" label={t('contacts.visual')} errors={errors} touched={touched} isRequired />
            <SelectField
              name="type"
              label={t('common.type')}
              errors={errors}
              touched={touched}
              options={[
                { label: 'SUBSCRIBER', value: 'SUBSCRIBER' },
                { label: 'USER', value: 'USER' },
                { label: 'INSTALLER', value: 'INSTALLER' },
                { label: 'CSR', value: 'CSR' },
                { label: 'MANAGER', value: 'MANAGER' },
                { label: 'BUSINESSOWNER', value: 'BUSINESSOWNER' },
                { label: 'TECHNICIAN', value: 'TECHNICIAN' },
                { label: 'CORPORATE', value: 'CORPORATE' },
              ]}
            />
            <SelectField
              name="salutation"
              label={t('contacts.salutation')}
              errors={errors}
              touched={touched}
              options={[
                { value: '', label: t('common.none') },
                { value: 'Mr.', label: 'Mr.' },
                { value: 'Ms.', label: 'Ms.' },
                { value: 'Mx.', label: 'Mx.' },
                { value: 'Dr.', label: 'Dr.' },
              ]}
            />
            <StringField name="title" label={t('contacts.title')} errors={errors} touched={touched} />
            <StringField
              name="firstname"
              label={t('contacts.first_name')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <StringField name="lastname" label={t('contacts.last_name')} errors={errors} touched={touched} />
            <StringField name="initials" label={t('contacts.initials')} errors={errors} touched={touched} />
            <StringField name="description" label={t('common.description')} errors={errors} touched={touched} />
            <StringField
              name="primaryEmail"
              label={t('contacts.primary_email')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <StringField
              name="secondaryEmail"
              label={t('contacts.secondary_email')}
              errors={errors}
              touched={touched}
            />
            <MultiPhoneNumberField
              name="phones"
              label={t('contacts.phones')}
              errors={errors}
              touched={touched}
              placeholder="+1(202)555-0103"
              setFieldValue={setFieldValue}
            />
            <CreatableSelectField
              name="mobiles"
              label={t('contacts.mobiles')}
              errors={errors}
              touched={touched}
              placeholder="+1(202)555-0103"
              setFieldValue={setFieldValue}
            />
            <StringField name="accessPIN" label={t('contacts.access_pin')} errors={errors} touched={touched} />
            <StringField name="note" label={t('common.note')} errors={errors} touched={touched} />
          </SimpleGrid>
        </Form>
      )}
    </Formik>
  );
};

CreateOperatorContactForm.propTypes = propTypes;

export default CreateOperatorContactForm;
