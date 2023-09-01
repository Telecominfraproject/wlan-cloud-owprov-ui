import * as React from 'react';
import { Box, Flex, FormControl, FormLabel } from '@chakra-ui/react';
import { Form } from 'formik';
import { useTranslation } from 'react-i18next';
import LocationDisplayButton from './LocationDisplayButton';
import LocationPickerCreator from 'components/CreateObjectsForms/LocationPickerCreator';
import FormattedDate from 'components/FormattedDate';
import StringField from 'components/FormFields/StringField';
import { VenueApiResponse } from 'models/Venue';

type Props = {
  isDisabled: boolean;
  venue: VenueApiResponse;
};

const VenueDetailsForm = ({ isDisabled, venue }: Props) => {
  const { t } = useTranslation();

  return (
    <Form>
      <Flex>
        <StringField name="name" label={t('common.name')} isDisabled={isDisabled} isRequired w="240px" />
        <FormControl w="300px" mx={2}>
          <FormLabel>{t('locations.one')}</FormLabel>
          <Flex>
            <LocationPickerCreator
              locationName="location"
              createLocationName="__createLocation"
              editing={!isDisabled}
              venueId={venue.id}
              hideLabel
              isModal
            />
            {isDisabled ? <LocationDisplayButton locationId={venue.location} /> : null}
          </Flex>
        </FormControl>
        <FormControl ml={4} w="200px">
          <FormLabel>{t('common.modified')}</FormLabel>
          <Box pt={2}>
            <FormattedDate date={venue.modified} />
          </Box>
        </FormControl>
      </Flex>
      <StringField name="description" label={t('common.description')} isDisabled={isDisabled} isArea h="80px" />
    </Form>
  );
};

export default VenueDetailsForm;
