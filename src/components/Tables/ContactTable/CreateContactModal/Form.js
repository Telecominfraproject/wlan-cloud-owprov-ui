import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { CreateContactSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import { useCreateContact } from 'hooks/Network/Contacts';
import SelectField from 'components/FormFields/SelectField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import { useQueryClient } from 'react-query';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  parent: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
};

const CreateContactForm = ({ isOpen, onClose, refresh, formRef, parent, onCreate }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());
  const queryClient = useQueryClient();

  const create = useCreateContact();

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
        entity: parent,
        note: '',
      }}
      validationSchema={CreateContactSchema(t)}
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
          entity,
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
            entity: entity === '' || entity.split(':')[0] !== 'ent' ? undefined : entity.split(':')[1],
            venue: entity === '' || entity.split(':')[0] !== 'ven' ? undefined : entity.split(':')[1],
            notes: note.length > 0 ? [{ note }] : undefined,
          },
          {
            onSuccess: async ({ data }) => {
              toast({
                id: 'contact-creation-success',
                title: t('common.success'),
                description: t('crud.success_create_obj', {
                  obj: t('contacts.one'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              onCreate(data.id);
              setSubmitting(false);
              resetForm();
              refresh();
              onClose();
              queryClient.invalidateQueries(['get-all-contacts']);
            },
            onError: (e) => {
              toast({
                id: uuid(),
                title: t('common.error'),
                description: t('crud.error_create_obj', {
                  obj: t('contacts.one'),
                  e: e?.response?.data?.ErrorDescription,
                }),
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              setSubmitting(false);
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
            <CreatableSelectField
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

CreateContactForm.propTypes = propTypes;

export default CreateContactForm;
