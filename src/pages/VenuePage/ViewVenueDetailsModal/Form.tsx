import * as React from 'react';
import { Box, Flex, FormControl, FormLabel, Heading } from '@chakra-ui/react';
import { Form } from 'formik';
import { useTranslation } from 'react-i18next';
import LocationPickerCreator from 'components/CreateObjectsForms/LocationPickerCreator';
import IpDetectionModalField from 'components/CustomFields/IpDetectionModalField';
import RrmFormField from 'components/CustomFields/RrmFormField';
import FormattedDate from 'components/FormattedDate';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import { VenueApiResponse } from 'models/Venue';

type Props = {
  isDisabled: boolean;
  venue: VenueApiResponse;
};

const VenueDetailsForm = ({ isDisabled, venue }: Props) => {
  const { t } = useTranslation();

  const options = [
    { value: 'yes', label: t('common.yes') },
    { value: 'no', label: t('common.no') },
    { value: 'inherit', label: t('common.inherit') },
  ];

  return (
    <Form>
      <Heading size="md" mb={2}>
        {t('common.identification')}
      </Heading>
      <Flex>
        <StringField name="name" label={t('common.name')} isDisabled={isDisabled} isRequired w="300px" />
        <FormControl ml={4}>
          <FormLabel>{t('common.modified')}</FormLabel>
          <Box pt={2}>
            <FormattedDate date={venue.modified} />
          </Box>
        </FormControl>
      </Flex>
      <StringField name="description" label={t('common.description')} isDisabled={isDisabled} isArea h="80px" />
      <Heading size="md" mt={4} mb={2}>
        {t('inventory.title')} {t('configurations.one')}
      </Heading>
      <IpDetectionModalField name="sourceIP" isDisabled={isDisabled} />
      <Flex>
        <Box w="200px">
          <SelectField
            name="deviceRules.rcOnly"
            label={t('configurations.rc_only')}
            isDisabled={isDisabled}
            options={options}
            w="100px"
          />
        </Box>
        <Box w="200px">
          <SelectField
            name="deviceRules.firmwareUpgrade"
            label={t('configurations.firmware_upgrade')}
            isDisabled={isDisabled}
            options={options}
            w="100px"
          />
        </Box>
        <Box>
          <RrmFormField namePrefix="deviceRules" isDisabled={isDisabled} />
        </Box>
      </Flex>
      <Heading size="md" mt={4} mb={2}>
        {t('locations.one')} Management
      </Heading>
      <Heading size="sm" mb={2}>
        Use the list below to either create a new location or select an existing one
      </Heading>
      <Box w="300px">
        <LocationPickerCreator
          locationName="location"
          createLocationName="__createLocation"
          editing={!isDisabled}
          venueId={venue.id}
          hideLabel
          isModal
        />
      </Box>
    </Form>
  );
};

export default VenueDetailsForm;
