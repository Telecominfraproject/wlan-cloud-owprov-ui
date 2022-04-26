import React from 'react';
import PropTypes from 'prop-types';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import DisplaySelectField from 'components/DisplayFields/DisplaySelectField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};

const LockedEncryption = ({ data }) => {
  if (!data) return null;

  return (
    <>
      <Heading size="md" display="flex" mt={6}>
        <Text mr={2}>Encryption</Text>
        <Switch
          // eslint-disable-next-line react/prop-types
          isChecked={data?.encryption !== undefined}
          borderRadius="15px"
          size="lg"
          isDisabled
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        />
      </Heading>
      {data?.encryption !== undefined && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <DisplaySelectField
            label="protocol"
            value={data?.proto}
            definitionKey="interface.ssid.encryption.proto"
            options={[
              { value: 'psk', label: 'WPA-PSK' },
              { value: 'psk2', label: 'WPA2-PSK' },
              { value: 'psk-mixed', label: 'WPA-PSK/WPA2-PSK Personal Mixed' },
              { value: 'wpa2', label: 'WPA2-Enterprise EAP-TLS' },
              { value: 'sae-mixed', label: 'WPA2/WPA3 Transitional' },
              { value: 'wpa3', label: 'WPA3-Enterprise EAP-TLS' },
              { value: 'wpa3-192', label: 'WPA3-192-Enterprise EAP-TLS' },
            ]}
            isRequired
          />
          <DisplaySelectField
            label="ieee80211w"
            value={data?.ieee80211w}
            definitionKey="interface.ssid.encryption.ieee80211w"
            options={[
              { value: 'disabled', label: 'disabled' },
              { value: 'optional', label: 'optional' },
              { value: 'required', label: 'required' },
            ]}
            isRequired
          />
          {data?.encryption?.key !== undefined && (
            <DisplayStringField
              value={data?.encryption?.key}
              label="key"
              definitionKey="interface.ssid.encryption.key"
              isDisabled
              isRequired
              hideButton
            />
          )}
        </SimpleGrid>
      )}
    </>
  );
};

LockedEncryption.propTypes = propTypes;
export default React.memo(LockedEncryption);
