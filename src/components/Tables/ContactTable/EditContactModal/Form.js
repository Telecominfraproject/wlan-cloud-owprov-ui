import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid } from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { ContactShape } from 'constants/propShapes';
import { CreateContactSchema } from 'constants/formSchemas';
import { useGetEntities } from 'hooks/Network/Entity';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import { useUpdateContact } from 'hooks/Network/Contacts';
import SelectField from 'components/FormFields/SelectField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  contact: PropTypes.shape(ContactShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const EditContactForm = ({ editing, isOpen, onClose, refresh, contact, formRef }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());
  const { data: entities } = useGetEntities({ t, toast });
  const updateContact = useUpdateContact({ id: contact.id });

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={contact}
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
          notes,
        },
        { setSubmitting, resetForm },
      ) =>
        updateContact.mutateAsync(
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
            notes: notes.filter((note) => note.isNew),
          },
          {
            onSuccess: () => {
              toast({
                id: 'contact-update-success',
                title: t('common.success'),
                description: t('crud.success_update_obj', {
                  obj: t('contacts.one'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });

              setSubmitting(false);
              resetForm();
              refresh();
              onClose();
            },
            onError: (e) => {
              toast({
                id: uuid(),
                title: t('common.error'),
                description: t('crud.error_update_obj', {
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
        <Tabs variant="enclosed">
          <TabList>
            <Tab>{t('common.main')}</Tab>
            <Tab>{t('common.notes')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Form>
                <SimpleGrid minChildWidth="300px" spacing="20px">
                  <StringField
                    name="name"
                    label={t('contacts.visual')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                    isRequired
                  />
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
                    isDisabled={!editing}
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
                    isDisabled={!editing}
                  />
                  <StringField
                    name="title"
                    label={t('contacts.title')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                  />
                  <StringField
                    name="firstname"
                    label={t('contacts.first_name')}
                    errors={errors}
                    touched={touched}
                    isRequired
                    isDisabled={!editing}
                  />
                  <StringField
                    name="lastname"
                    label={t('contacts.last_name')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                  />
                  <StringField
                    name="initials"
                    label={t('contacts.initials')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                  />
                  <StringField
                    name="description"
                    label={t('common.description')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                  />
                  <StringField
                    name="primaryEmail"
                    label={t('contacts.primary_email')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                    isRequired
                  />
                  <StringField
                    name="secondaryEmail"
                    label={t('contacts.secondary_email')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                  />
                  <CreatableSelectField
                    name="phones"
                    label={t('contacts.phones')}
                    errors={errors}
                    touched={touched}
                    placeholder="+1(202)555-0103"
                    setFieldValue={setFieldValue}
                    isDisabled={!editing}
                  />
                  <CreatableSelectField
                    name="mobiles"
                    label={t('contacts.mobiles')}
                    errors={errors}
                    touched={touched}
                    placeholder="+1(202)555-0103"
                    setFieldValue={setFieldValue}
                    isDisabled={!editing}
                  />
                  <StringField
                    name="accessPIN"
                    label={t('contacts.access_pin')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                  />
                  <StringField
                    name="note"
                    label={t('common.note')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                  />
                  <SelectWithSearchField
                    name="entity"
                    label={t('entities.one')}
                    errors={errors}
                    touched={touched}
                    options={
                      entities?.map((ent) => ({
                        value: ent.id,
                        label: `${ent.name}${ent.description ? `: ${ent.description}` : ''}`,
                      })) ?? []
                    }
                    setFieldValue={setFieldValue}
                    isDisabled={!editing}
                    isRequired
                  />
                </SimpleGrid>
              </Form>
            </TabPanel>
            <TabPanel>
              <Field name="notes">
                {({ field }) => <NotesTable notes={field.value} setNotes={setFieldValue} isDisabled={!editing} />}
              </Field>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Formik>
  );
};

EditContactForm.propTypes = propTypes;

export default EditContactForm;
