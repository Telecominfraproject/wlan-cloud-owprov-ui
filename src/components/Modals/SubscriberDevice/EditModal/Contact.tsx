import React from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleGrid } from '@chakra-ui/react';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';

interface Props {
  editing: boolean;
}

const SubscriberDeviceContactForm: React.FC<Props> = ({ editing }) => {
  const { t } = useTranslation();

  return (
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
        isDisabled={!editing}
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
        isDisabled={!editing}
      />
      <StringField name="contact.title" label={t('contacts.title')} isDisabled={!editing} />
      <StringField name="contact.firstname" label={t('contacts.first_name')} isRequired isDisabled={!editing} />
      <StringField name="contact.lastname" label={t('contacts.last_name')} isDisabled={!editing} />
      <StringField name="contact.initials" label={t('contacts.initials')} isDisabled={!editing} />
      <StringField name="contact.primaryEmail" label={t('contacts.primary_email')} isRequired isDisabled={!editing} />
      <StringField name="contact.secondaryEmail" label={t('contacts.secondary_email')} isDisabled={!editing} />
      <CreatableSelectField
        name="contact.phones"
        label={t('contacts.phones')}
        placeholder="+1(202)555-0103"
        isDisabled={!editing}
      />
      <CreatableSelectField
        name="contact.mobiles"
        label={t('contacts.mobiles')}
        placeholder="+1(202)555-0103"
        isDisabled={!editing}
      />
      <StringField name="contact.accessPIN" label={t('contacts.access_pin')} isDisabled={!editing} />
    </SimpleGrid>
  );
};

export default SubscriberDeviceContactForm;
