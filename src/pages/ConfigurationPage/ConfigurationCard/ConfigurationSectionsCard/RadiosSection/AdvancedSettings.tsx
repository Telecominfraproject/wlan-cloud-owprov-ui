import React from 'react';
import { Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import NumberField from 'components/FormFields/NumberField';
import SelectField from 'components/FormFields/SelectField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import { useTranslation } from 'react-i18next';
import He from './He';

const AdvancedSettings: React.FC<{ editing: boolean; index: number }> = ({ editing, index }) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex>
        <Heading size="md" pt={2} borderBottom="1px solid">
          {t('configurations.advanced_settings')}
        </Heading>
      </Flex>
      <SimpleGrid minChildWidth="300px" spacing="20px">
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
        <CreatableSelectField
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
      </SimpleGrid>
    </>
  );
};

export default AdvancedSettings;
