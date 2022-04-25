import * as React from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { SubscriberDeviceLocationSchema } from 'constants/formSchemas';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import AddressSearchField from 'components/CustomFields/AddressSearchField';
import COUNTRY_LIST from 'constants/countryList';

interface Props {
  formRef: React.Ref<FormikProps<Record<string, unknown>>> | undefined;
  finishStep: (v: Record<string, unknown>) => void;
}

const CreateSubscriberDeviceStep2: React.FC<Props> = ({ formRef, finishStep }) => {
  const { t } = useTranslation();

  return (
    <>
      <Heading size="md" mb={2}>
        {t('locations.one')}
      </Heading>
      <Formik
        innerRef={formRef}
        initialValues={{
          type: 'SERVICE',
          addressLineOne: '',
          addressLineTwo: '',
          city: '',
          state: '',
          postal: '',
          country: '',
          buildingName: '',
          mobiles: [],
          phones: [],
          geoCode: '',
        }}
        validateOnMount
        validationSchema={SubscriberDeviceLocationSchema(t)}
        onSubmit={(data) => {
          const addressLines = [data.addressLineOne];
          if (data.addressLineTwo !== '') addressLines.push(data.addressLineTwo);
          finishStep({ location: { ...data, addressLines } });
        }}
      >
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
            <SelectField
              name="type"
              label={t('common.type')}
              options={[
                { label: 'SERVICE', value: 'SERVICE' },
                { label: 'EQUIPMENT', value: 'EQUIPMENT' },
                { label: 'AUTO', value: 'AUTO' },
                { label: 'MANUAL', value: 'MANUAL' },
                { label: 'SPECIAL', value: 'SPECIAL' },
                { label: 'UNKNOWN', value: 'UNKNOWN' },
                { label: 'CORPORATE', value: 'CORPORATE' },
              ]}
            />
            <CreatableSelectField name="phones" label={t('contacts.phones')} placeholder="+1(202)555-0103" />
            <CreatableSelectField name="mobiles" label={t('contacts.mobiles')} placeholder="+1(202)555-0103" />
          </SimpleGrid>

          <AddressSearchField placeholder={t('common.address_search_autofill')} maxWidth="600px" mb={2} />
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
            <StringField name="addressLineOne" label={t('locations.address_line_one')} isRequired />
            <StringField name="addressLineTwo" label={t('locations.address_line_two')} />
            <StringField name="city" label={t('locations.city')} isRequired />
            <StringField name="state" label={t('locations.state')} isRequired />
            <StringField name="postal" label={t('locations.postal')} isRequired />
            <SelectField name="country" label={t('locations.country')} options={COUNTRY_LIST} />
            <StringField name="buildingName" label={t('locations.building_name')} />
            <StringField name="geoCode" label={t('locations.geocode')} />
          </SimpleGrid>
        </Form>
      </Formik>
    </>
  );
};

export default CreateSubscriberDeviceStep2;
