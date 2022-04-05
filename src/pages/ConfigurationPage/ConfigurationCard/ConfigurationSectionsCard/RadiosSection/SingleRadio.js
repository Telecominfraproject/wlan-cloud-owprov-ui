import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { Box, SimpleGrid, Spacer } from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import { useTranslation } from 'react-i18next';
import COUNTRY_LIST from 'constants/countryList';
import ToggleField from 'components/FormFields/ToggleField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import SelectField from 'components/FormFields/SelectField';
import NumberField from 'components/FormFields/NumberField';
import ChannelPicker from './ChannelPicker';
import He from './He';
import Rates from './Rates';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
};

const SingleRadio = ({ editing, index, remove }) => {
  const { t } = useTranslation();
  const removeRadio = () => remove(index);

  return (
    <Card variant="widget" mb={4}>
      <CardHeader flex="auto">
        <Box>#{index} Radio</Box>
        <Spacer />
        <DeleteButton isDisabled={!editing} onClick={removeRadio} label={t('configurations.delete_radio')} />
      </CardHeader>
      <CardBody>
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
            name={`configuration[${index}].require-mode`}
            label="require-mode"
            definitionKey="radio.require-mode"
            isDisabled={!editing}
            options={[
              { value: '', label: 'None' },
              { value: 'HT', label: 'HT (A,B,G,N)' },
              { value: 'VHT', label: 'VHT (A,B,G,N,AC)' },
              { value: 'HE', label: 'HE (WiFi 6,A,B,G,N,AC,AX)' },
            ]}
            emptyIsUndefined
          />
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
          <SelectField
            name={`configuration[${index}].rates.beacon`}
            label="beacon-rate"
            definitionKey="radio.rates.beacon"
            isDisabled={!editing}
            isInt
            emptyIsUndefined
            options={[
              { value: '', label: t('common.none') },
              { value: 1000, label: '1000' },
              { value: 2000, label: '2000' },
              { value: 5500, label: '5500' },
              { value: 6000, label: '6000' },
              { value: 9000, label: '9000' },
              { value: 11000, label: '11000' },
              { value: 12000, label: '12000' },
              { value: 18000, label: '18000' },
              { value: 24000, label: '24000' },
              { value: 36000, label: '36000' },
              { value: 48000, label: '48000' },
              { value: 54000, label: '54000' },
            ]}
          />
          <NumberField
            name={`configuration[${index}].beacon-interval`}
            label="beacon-interval"
            definitionKey="radio.beacon-interval"
            isDisabled={!editing}
            isRequired
            w={24}
          />
          <NumberField
            name={`configuration[${index}].dtim-period`}
            label="dtim-period"
            definitionKey="radio.dtim-period"
            isDisabled={!editing}
            isRequired
            w={24}
          />
          <NumberField
            name={`configuration[${index}].maximum-clients`}
            label="maximum-clients"
            definitionKey="radio.maximum-clients"
            isDisabled={!editing}
            isRequired
            w={24}
          />
          <CreatableSelectField
            editing={editing}
            name={`configuration[${index}].hostapd-iface-raw`}
            label="hostapd-iface-raw"
            definitionKey="radio.hostapd-iface-raw"
            isDisabled={!editing}
            placeholder={t('configurations.hostapd_warning')}
            emptyIsUndefined
          />
          <SelectField
            name={`configuration[${index}].rates.multicast`}
            label="multicast"
            definitionKey="radio.rates.multicast"
            isDisabled={!editing}
            isInt
            emptyIsUndefined
            options={[
              { value: '', label: t('common.none') },
              { value: 1000, label: '1000' },
              { value: 2000, label: '2000' },
              { value: 5500, label: '5500' },
              { value: 6000, label: '6000' },
              { value: 9000, label: '9000' },
              { value: 11000, label: '11000' },
              { value: 12000, label: '12000' },
              { value: 18000, label: '18000' },
              { value: 24000, label: '24000' },
              { value: 36000, label: '36000' },
              { value: 48000, label: '48000' },
              { value: 54000, label: '54000' },
            ]}
          />
          <He editing={editing} index={index} />
          <Rates index={index} />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

SingleRadio.propTypes = propTypes;
export default React.memo(SingleRadio);
