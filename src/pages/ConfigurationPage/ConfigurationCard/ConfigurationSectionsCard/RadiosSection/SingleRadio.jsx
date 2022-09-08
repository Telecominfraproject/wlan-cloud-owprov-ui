import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import { useTranslation } from 'react-i18next';
import COUNTRY_LIST from 'constants/countryList';
import ToggleField from 'components/FormFields/ToggleField';
import SelectField from 'components/FormFields/SelectField';
import NumberField from 'components/FormFields/NumberField';
import ChannelPicker from './ChannelPicker';
import Rates from './Rates';
import AdvancedSettings from './AdvancedSettings';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
};

const SingleRadio = ({ editing, index, remove }) => {
  const { t } = useTranslation();
  const removeRadio = () => remove(index);

  return (
    <>
      <Flex>
        <Heading pt={4} size="md" borderBottom="1px solid">
          General
        </Heading>
        <Spacer />
        <DeleteButton isDisabled={!editing} onClick={removeRadio} label={t('configurations.delete_radio')} />
      </Flex>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <SelectField
          name={`configuration[${index}].band`}
          label="band"
          definitionKey="radio.band"
          isDisabled
          isRequired
          options={[
            { value: '2G', label: '2G' },
            { value: '5G', label: '5G' },
            { value: '5G-lower', label: '5G-lower' },
            { value: '5G-upper', label: '5G-upper' },
            { value: '6G', label: '6G' },
          ]}
        />
        <SelectField
          name={`configuration[${index}].bandwidth`}
          label="bandwidth"
          definitionKey="radio.bandwidth"
          isDisabled={!editing}
          isInt
          isRequired
          options={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
          ]}
        />
        <SelectField
          name={`configuration[${index}].country`}
          label="country"
          definitionKey="radio.country"
          isDisabled={!editing}
          isRequired
          options={COUNTRY_LIST}
        />
        <SelectField
          name={`configuration[${index}].channel-mode`}
          label="channel-mode"
          definitionKey="radio.channel-mode"
          isDisabled={!editing}
          isRequired
          options={[
            { value: 'HT', label: 'HT (A,B,G,N)' },
            { value: 'VHT', label: 'VHT (A,B,G,N,AC)' },
            { value: 'HE', label: 'HE (WiFi 6,A,B,G,N,AC,AX)' },
          ]}
        />
        <SelectField
          name={`configuration[${index}].channel-width`}
          label="channel-width"
          definitionKey="radio.channel-width"
          isRequired
          isDisabled={!editing}
          isInt
          options={[
            { value: 20, label: '20 MHz' },
            { value: 40, label: '40 MHz' },
            { value: 80, label: '80 MHz' },
            { value: 160, label: '160 MHz' },
          ]}
        />
        <ChannelPicker index={index} isDisabled={!editing} />
        <SelectField
          name={`configuration[${index}].mimo`}
          label="mimo"
          definitionKey="radio.mimo"
          isDisabled={!editing}
          options={[
            { value: '', label: 'None' },
            { value: '1x1', label: '1x1' },
            { value: '2x2', label: '2x2' },
            { value: '3x3', label: '3x3' },
            { value: '4x4', label: '4x4' },
            { value: '5x5', label: '5x5' },
            { value: '6x6', label: '6x6' },
            { value: '7x7', label: '7x7' },
            { value: '8x8', label: '8x8' },
          ]}
          emptyIsUndefined
        />
        <NumberField
          name={`configuration[${index}].tx-power`}
          label="tx-power"
          definitionKey="radio.tx-power"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <ToggleField
          name={`configuration[${index}].legacy-rates`}
          label="legacy-rates"
          definitionKey="radio.legacy-rates"
          isDisabled={!editing}
          falseIsUndefined
        />
        <NumberField
          name={`configuration[${index}].maximum-clients`}
          label="maximum-clients"
          definitionKey="radio.maximum-clients"
          isDisabled={!editing}
          acceptEmptyValue
          w={24}
        />
        <ToggleField
          name={`configuration[${index}].he.multiple-bssid`}
          label="multiple-bssid"
          definitionKey="radio.he.multiple-bssid"
          isDisabled={!editing}
          falseIsUndefined
        />
        <Rates index={index} />
      </SimpleGrid>
      <AdvancedSettings index={index} editing={editing} />
    </>
  );
};

SingleRadio.propTypes = propTypes;
export default React.memo(SingleRadio);
