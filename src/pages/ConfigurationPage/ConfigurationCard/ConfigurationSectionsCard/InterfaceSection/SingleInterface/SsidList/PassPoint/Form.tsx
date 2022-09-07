import React from 'react';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import ToggleField from 'components/FormFields/ToggleField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import NumberField from 'components/FormFields/NumberField';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';

interface Props {
  isDisabled?: boolean;
  namePrefix: string;
  isEnabled: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PassPointForm: React.FC<Props> = ({ isDisabled, namePrefix, isEnabled, onToggle }) => {
  const name = React.useCallback((suffix: string) => `${namePrefix}.${suffix}`, []);

  const fieldProps = (suffix: string) => ({
    name: name(suffix),
    label: suffix,
    definitionKey: `interface.ssid.pass-point.${suffix}`,
    isDisabled,
  });

  return (
    <>
      <Heading size="md" display="flex">
        <Text mr={2} borderBottom="1px solid">
          Pass Point
        </Text>
        <Switch
          onChange={onToggle}
          isChecked={isEnabled}
          borderRadius="15px"
          size="lg"
          isDisabled={isDisabled}
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        />
      </Heading>
      {isEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <CreatableSelectField
            {...fieldProps('venue-name')}
            emptyIsUndefined
            placeholder="eng:Example passpoint_venue"
          />
          <CreatableSelectField
            {...fieldProps('venue-url')}
            emptyIsUndefined
            placeholder="http://www.example.com/info-fra"
          />
          <NumberField {...fieldProps('venue-group')} w="80px" acceptEmptyValue emptyIsUndefined isRequired />
          <NumberField {...fieldProps('venue-type')} w="80px" acceptEmptyValue emptyIsUndefined isRequired />
          <NumberField {...fieldProps('access-network-type')} w="80px" acceptEmptyValue emptyIsUndefined isRequired />
          <SelectField
            {...fieldProps('auth-type.type')}
            options={[
              { value: 'terms-and-conditions', label: 'Terms and Conditions' },
              { value: 'online-enrollment', label: 'Online Enrollment' },
              { value: 'http-redirection', label: 'HTTP Redirection' },
              { value: 'dns-redirection', label: 'DNS Redirection' },
            ]}
            w="200px"
            isRequired
          />
          <StringField {...fieldProps('auth-type.url')} emptyIsUndefined isDisabled={isDisabled} />
          <CreatableSelectField {...fieldProps('domain-name')} emptyIsUndefined placeholder="test.com" />
          <CreatableSelectField {...fieldProps('nai-realm')} placeholder="test.com" />
          <ToggleField {...fieldProps('osen')} emptyIsUndefined />
          <NumberField {...fieldProps('anqp-domain')} isRequired />
          <CreatableSelectField {...fieldProps('anqp-3gpp-cell-net')} emptyIsUndefined placeholder="310,410" />
          <CreatableSelectField {...fieldProps('friendly-name')} emptyIsUndefined placeholder="eng:TestLabs" />
          <ToggleField {...fieldProps('internet')} />
          <ToggleField {...fieldProps('asra')} falseIsUndefined />
          <ToggleField {...fieldProps('esr')} falseIsUndefined />
          <ToggleField {...fieldProps('uesa')} falseIsUndefined />
          <ToggleField {...fieldProps('hessid')} falseIsUndefined />
          <CreatableSelectField {...fieldProps('roaming-consortium')} emptyIsUndefined placeholder="BAA2D00100" />
          <ToggleField {...fieldProps('disable-dgaf')} falseIsUndefined />
          <NumberField {...fieldProps('ipaddr-type-available')} acceptEmptyValue emptyIsUndefined />
          <SelectField
            {...fieldProps('wan-metrics.type')}
            options={[
              { value: 'up', label: 'up' },
              { value: 'down', label: 'down' },
              { value: 'testing', label: 'testing' },
            ]}
            w="100px"
            isRequired
          />
          <NumberField
            {...fieldProps('wan-metrics.downlink')}
            w="150px"
            unit="kbps"
            isRequired
            acceptEmptyValue
            emptyIsUndefined
          />
          <NumberField
            {...fieldProps('wan-metrics.uplink')}
            w="150px"
            unit="kbps"
            isRequired
            acceptEmptyValue
            emptyIsUndefined
          />
          <CreatableSelectField {...fieldProps('connection-capability')} emptyIsUndefined placeholder="17:5060:0" />
        </SimpleGrid>
      )}
    </>
  );
};

export default React.memo(PassPointForm);
