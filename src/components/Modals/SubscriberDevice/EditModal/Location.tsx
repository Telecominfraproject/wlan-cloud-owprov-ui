import React from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleGrid } from '@chakra-ui/react';
import AddressSearchField from 'components/CustomFields/AddressSearchField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import COUNTRY_LIST from 'constants/countryList';

interface Props {
  editing: boolean;
}

const SubscriberDeviceLocationForm: React.FC<Props> = ({ editing }) => {
  const { t } = useTranslation();

  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
        <SelectField
          name="location.type"
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
          isDisabled={!editing}
        />
        <CreatableSelectField
          name="location.phones"
          label={t('contacts.phones')}
          placeholder="+1(202)555-0103"
          isDisabled={!editing}
        />
        <CreatableSelectField
          name="location.mobiles"
          label={t('contacts.mobiles')}
          placeholder="+1(202)555-0103"
          isDisabled={!editing}
        />
      </SimpleGrid>
      <AddressSearchField
        namePrefix="location"
        placeholder={t('common.address_search_autofill')}
        maxWidth="600px"
        mb={2}
        isDisabled={!editing}
      />
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
        <StringField
          name="location.addressLineOne"
          label={t('locations.address_line_one')}
          isRequired
          isDisabled={!editing}
        />
        <StringField name="location.addressLineTwo" label={t('locations.address_line_two')} isDisabled={!editing} />
        <StringField name="location.city" label={t('locations.city')} isRequired isDisabled={!editing} />
        <StringField name="location.state" label={t('locations.state')} isRequired isDisabled={!editing} />
        <StringField name="location.postal" label={t('locations.postal')} isRequired isDisabled={!editing} />
        <SelectField
          name="location.country"
          label={t('locations.country')}
          options={COUNTRY_LIST}
          isDisabled={!editing}
        />
        <StringField name="location.buildingName" label={t('locations.building_name')} isDisabled={!editing} />
        <StringField name="location.geoCode" label={t('locations.geocode')} isDisabled={!editing} />
      </SimpleGrid>
    </>
  );
};

export default SubscriberDeviceLocationForm;
