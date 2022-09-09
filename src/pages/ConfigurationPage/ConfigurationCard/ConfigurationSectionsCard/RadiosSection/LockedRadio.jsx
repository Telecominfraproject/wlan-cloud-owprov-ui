import React, { useMemo } from 'react';
import { Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FastCreatableSelectInput from 'components/FormFields/CreatableSelectField/FastCreatableSelectInput';
import NumberInput from 'components/FormFields/NumberField/NumberInput';
import FastSelectInput from 'components/FormFields/SelectField/FastSelectInput';
import FastToggleInput from 'components/FormFields/ToggleField/FastToggleInput';
import { useGetResource } from 'hooks/Network/Resources';
import COUNTRY_LIST from 'constants/countryList';

const propTypes = {
  variableBlockId: PropTypes.string.isRequired,
};

const LockedRadio = ({ variableBlockId }) => {
  const { t } = useTranslation();
  const { data: resource } = useGetResource({
    id: variableBlockId,
    enabled: true,
  });

  const data = useMemo(() => {
    if (resource && resource.variables[0]) {
      return JSON.parse(resource.variables[0].value);
    }
    return null;
  }, [resource]);

  const props = (key) => ({
    value: data[key],
    label: key,
    isDisabled: true,
    definitionKey: `radio.${key}`,
  });

  if (!data) return null;

  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <FastSelectInput
          {...props('band')}
          isRequired
          options={[
            { value: '2G', label: '2G' },
            { value: '5G', label: '5G' },
            { value: '5G-lower', label: '5G-lower' },
            { value: '5G-upper', label: '5G-upper' },
            { value: '6G', label: '6G' },
          ]}
        />
        <FastSelectInput
          {...props('bandwidth')}
          isRequired
          options={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
          ]}
        />
        <FastSelectInput {...props('country')} isRequired options={COUNTRY_LIST} />
        <FastSelectInput
          {...props('channel-mode')}
          isRequired
          options={[
            { value: 'HT', label: 'HT (A,B,G,N)' },
            { value: 'VHT', label: 'VHT (A,B,G,N,AC)' },
            { value: 'HE', label: 'HE (WiFi 6,A,B,G,N,AC,AX)' },
          ]}
        />
        <FastSelectInput
          {...props('channel-width')}
          isRequired
          options={[
            { value: 'HT', label: 'HT (A,B,G,N)' },
            { value: 'VHT', label: 'VHT (A,B,G,N,AC)' },
            { value: 'HE', label: 'HE (WiFi 6,A,B,G,N,AC,AX)' },
          ]}
        />
        <FastSelectInput {...props('channel')} isRequired options={[{ value: data.channel, label: data.channel }]} />
        <FastSelectInput
          {...props('mimo')}
          isRequired
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
        />
        <NumberInput {...props('tx-power')} isRequired w={24} />
        <FastToggleInput {...props('legacy-rates')} />
        <NumberInput {...props('maximum-clients')} isRequired w={24} />
        <FastToggleInput {...props('he.multiple-bssid')} label="multiple-bssid" value={data.he?.['multiple-bssid']} />
      </SimpleGrid>
      <Flex>
        <Heading size="md" mt={2} textDecor="underline">
          {t('configurations.advanced_settings')}
        </Heading>
      </Flex>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <FastSelectInput
          {...props('rates.beacon')}
          label="beacon-rate"
          value={data.rates?.beacon}
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
        <NumberInput {...props('beacon-interval')} isRequired w={24} />
        <NumberInput {...props('dtim-period')} isRequired w={24} />
        <FastCreatableSelectInput {...props('hostapd-iface-raw')} />
        <FastSelectInput
          {...props('rates.multicast')}
          label="multicast"
          value={data.rates?.multicast}
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
        <FastToggleInput {...props('he.ema')} label="ema" value={data.he?.ema} />
        <NumberInput {...props('he.bss-color')} label="bss-color" value={data.he?.['bss-color']} w={24} />
        <FastSelectInput
          {...props('require-mode')}
          label="require-mode"
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
      </SimpleGrid>
    </>
  );
};

LockedRadio.propTypes = propTypes;
export default React.memo(LockedRadio);
