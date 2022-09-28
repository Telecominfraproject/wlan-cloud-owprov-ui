import React from 'react';
import { Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import DisplayNumberField from 'components/DisplayFields/DisplayNumberField';
import DisplaySelectField from 'components/DisplayFields/DisplaySelectField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import DisplayToggleField from 'components/DisplayFields/DisplayToggleField';
import FastCreatableSelectInput from 'components/FormFields/CreatableSelectField/FastCreatableSelectInput';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};

const LockedPasspoint = ({ data }) => {
  const fieldProps = (suffix) => ({
    name: suffix,
    label: suffix,
    value: data?.['pass-point']?.[suffix],
    definitionKey: `interface.ssid.pass-point.${suffix}`,
    isDisabled: true,
  });

  if (!data) return null;

  return (
    <>
      <Flex mt={4}>
        <Heading size="md" borderBottom="1px solid">
          Passpoint
        </Heading>
      </Flex>
      {data?.['pass-point'] !== undefined && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <FastCreatableSelectInput {...fieldProps('venue-name')} />
          <FastCreatableSelectInput {...fieldProps('venue-url')} />
          <DisplayNumberField {...fieldProps('venue-group')} w="80px" />
          <DisplayNumberField {...fieldProps('venue-type')} w="80px" />
          <DisplayNumberField {...fieldProps('access-network-type')} w="80px" />
          <DisplaySelectField
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
          <DisplayStringField {...fieldProps('auth-type.url')} emptyIsUndefined />
          <FastCreatableSelectInput {...fieldProps('domain-name')} />
          <FastCreatableSelectInput {...fieldProps('nai-realm')} />
          <DisplayToggleField {...fieldProps('osen')} />
          <DisplayNumberField {...fieldProps('anqp-domain')} isRequired />
          <FastCreatableSelectInput {...fieldProps('anqp-3gpp-cell-net')} />
          <FastCreatableSelectInput {...fieldProps('friendly-name')} />
          <DisplayToggleField {...fieldProps('internet')} />
          <DisplayToggleField {...fieldProps('asra')} />
          <DisplayToggleField {...fieldProps('esr')} />
          <DisplayToggleField {...fieldProps('uesa')} />
          <DisplayStringField {...fieldProps('hessid')} />
          <FastCreatableSelectInput {...fieldProps('roaming-consortium')} />
          <DisplayToggleField {...fieldProps('disable-dgaf')} />
          <DisplayNumberField {...fieldProps('ipaddr-type-available')} isRequired />
          <DisplaySelectField
            {...fieldProps('wan-metrics.type')}
            options={[
              { value: 'up', label: 'up' },
              { value: 'down', label: 'down' },
              { value: 'testing', label: 'testing' },
            ]}
            w="100px"
            isRequired
          />
          <DisplayNumberField
            {...fieldProps('wan-metrics.downlink')}
            w="150px"
            unit="kbps"
            isRequired
            acceptEmptyValue
            emptyIsUndefined
          />
          <DisplayNumberField
            {...fieldProps('wan-metrics.uplink')}
            w="150px"
            unit="kbps"
            isRequired
            acceptEmptyValue
            emptyIsUndefined
          />
          <FastCreatableSelectInput {...fieldProps('connection-capability')} />
        </SimpleGrid>
      )}
    </>
  );
};

LockedPasspoint.propTypes = propTypes;
export default React.memo(LockedPasspoint);
