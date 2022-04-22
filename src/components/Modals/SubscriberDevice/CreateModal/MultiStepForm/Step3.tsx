import * as React from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SelectField from 'components/FormFields/SelectField';
import { SubscriberDeviceContactSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';

interface Props {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
}

const CreateSubscriberDeviceStep3: React.FC<Props> = ({ formRef, finishStep }) => {
  const { t } = useTranslation();

  return (
    <>
      <Heading size="md" mb={2}>
        {t('contacts.one')}
      </Heading>
      <Formik
        innerRef={formRef}
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
        validateOnMount
        validationSchema={SubscriberDeviceContactSchema(t)}
        onSubmit={(data) => finishStep({ contact: data })}
      >
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
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
            />
            <StringField name="title" label={t('contacts.title')} />
            <StringField name="firstname" label={t('contacts.first_name')} isRequired />
            <StringField name="lastname" label={t('contacts.last_name')} />
            <StringField name="initials" label={t('contacts.initials')} />
            <StringField name="primaryEmail" label={t('contacts.primary_email')} isRequired />
            <StringField name="secondaryEmail" label={t('contacts.secondary_email')} />
            <CreatableSelectField name="phones" label={t('contacts.phones')} placeholder="+1(202)555-0103" />
            <CreatableSelectField name="mobiles" label={t('contacts.mobiles')} placeholder="+1(202)555-0103" />
            <StringField name="accessPIN" label={t('contacts.access_pin')} />
          </SimpleGrid>
        </Form>
      </Formik>
    </>
  );
};

export default CreateSubscriberDeviceStep3;
