import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { ContactShape } from 'constants/propShapes';
import { OperatorContactSchema } from 'constants/formSchemas';
import SelectField from 'components/FormFields/SelectField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import { useUpdateOperatorContact } from 'hooks/Network/OperatorContacts';
import useMutationResult from 'hooks/useMutationResult';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  contact: PropTypes.shape(ContactShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const EditOperatorContactForm = ({ editing, isOpen, onClose, refresh, contact, formRef }) => {
  const { t } = useTranslation();
  const { onSuccess, onError } = useMutationResult({
    objName: t('contacts.one'),
    operationType: 'update',
    refresh,
    onClose,
  });
  const [formKey, setFormKey] = useState(uuid());
  const updateContact = useUpdateOperatorContact({ id: contact.id });

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={contact}
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
            notes: notes.filter((note) => note.isNew),
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
      <Tabs variant="enclosed">
        <TabList>
          <Tab>{t('common.main')}</Tab>
          <Tab>{t('common.notes')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Form>
              <SimpleGrid minChildWidth="300px" spacing="20px">
                <StringField name="name" label={t('contacts.visual')} isDisabled={!editing} isRequired />
                <SelectField
                  name="type"
                  label={t('common.type')}
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
                  options={[
                    { value: '', label: t('common.none') },
                    { value: 'Mr.', label: 'Mr.' },
                    { value: 'Ms.', label: 'Ms.' },
                    { value: 'Mx.', label: 'Mx.' },
                    { value: 'Dr.', label: 'Dr.' },
                  ]}
                  isDisabled={!editing}
                />
                <StringField name="title" label={t('contacts.title')} isDisabled={!editing} />
                <StringField name="firstname" label={t('contacts.first_name')} isRequired isDisabled={!editing} />
                <StringField name="lastname" label={t('contacts.last_name')} isDisabled={!editing} />
                <StringField name="initials" label={t('contacts.initials')} isDisabled={!editing} />
                <StringField name="description" label={t('common.description')} isDisabled={!editing} />
                <StringField name="primaryEmail" label={t('contacts.primary_email')} isDisabled={!editing} isRequired />
                <StringField name="secondaryEmail" label={t('contacts.secondary_email')} isDisabled={!editing} />
                <CreatableSelectField
                  name="phones"
                  label={t('contacts.phones')}
                  placeholder="+1(202)555-0103"
                  isDisabled={!editing}
                />
                <CreatableSelectField
                  name="mobiles"
                  label={t('contacts.mobiles')}
                  placeholder="+1(202)555-0103"
                  isDisabled={!editing}
                />
                <StringField name="accessPIN" label={t('contacts.access_pin')} isDisabled={!editing} />
                <StringField name="note" label={t('common.note')} isDisabled={!editing} />
              </SimpleGrid>
            </Form>
          </TabPanel>
          <TabPanel>
            {' '}
            <NotesTable name="notes" isDisabled={!editing} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Formik>
  );
};

EditOperatorContactForm.propTypes = propTypes;

export default EditOperatorContactForm;
