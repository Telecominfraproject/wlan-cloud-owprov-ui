import * as React from 'react';
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { Formik, Form, FormikProps } from 'formik';
import { Flex, Heading, Select, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SelectField from 'components/FormFields/SelectField';
import { SubscriberDeviceContactSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import { DeviceContact } from 'models/Device';

interface Props {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
  contactSuggestions: { serialNumber: string; contact: DeviceContact }[];
}

const CreateSubscriberDeviceStep3: React.FC<Props> = ({ formRef, finishStep, contactSuggestions }) => {
  const { t } = useTranslation();

  const onChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean | undefined) => void,
  ) => {
    const found = contactSuggestions.find(({ serialNumber }) => serialNumber === e.target.value);
    if (found) setFieldValue('contact', found.contact);
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        contact: {
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
        },
      }}
      validateOnMount
      validationSchema={Yup.object().shape({ contact: SubscriberDeviceContactSchema(t) })}
      onSubmit={(data) => finishStep({ contact: data.contact })}
    >
      {({ setFieldValue }) => (
        <>
          <Flex mb={2}>
            <Heading pt={0.5} size="md">
              {t('contacts.one')}
            </Heading>
            <Select onChange={(e) => onChange(e, setFieldValue)} w="250px" ml={2} size="sm">
              <option value="">{t('operator.import_location_from_device')}</option>
              {contactSuggestions.map(({ serialNumber }) => (
                <option key={uuid()} value={serialNumber}>
                  {serialNumber}
                </option>
              ))}
            </Select>
          </Flex>
          <Form>
            <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
              <SelectField
                name="contact.type"
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
              />
              <SelectField
                name="contact.salutation"
                label={t('contacts.salutation')}
                options={[
                  { value: '', label: t('common.none') },
                  { value: 'Mr.', label: 'Mr.' },
                  { value: 'Ms.', label: 'Ms.' },
                  { value: 'Mx.', label: 'Mx.' },
                  { value: 'Dr.', label: 'Dr.' },
                ]}
              />
              <StringField name="contact.title" label={t('contacts.title')} />
              <StringField name="contact.firstname" label={t('contacts.first_name')} isRequired />
              <StringField name="contact.lastname" label={t('contacts.last_name')} />
              <StringField name="contact.initials" label={t('contacts.initials')} />
              <StringField name="contact.primaryEmail" label={t('contacts.primary_email')} isRequired />
              <StringField name="contact.secondaryEmail" label={t('contacts.secondary_email')} />
              <CreatableSelectField name="contact.phones" label={t('contacts.phones')} placeholder="+1(202)555-0103" />
              <CreatableSelectField
                name="contact.mobiles"
                label={t('contacts.mobiles')}
                placeholder="+1(202)555-0103"
              />
              <StringField name="contact.accessPIN" label={t('contacts.access_pin')} />
            </SimpleGrid>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default CreateSubscriberDeviceStep3;
