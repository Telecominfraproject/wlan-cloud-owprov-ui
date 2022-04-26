import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext, getIn } from 'formik';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { INTERFACE_SSID_ENCRYPTION_SCHEMA } from './schemas';

const propTypes = {
  radiusPrefix: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired,
};

const namePrefix = `encryption`;

const keyProtos = ['psk', 'psk2', 'psk-mixed', 'sae-mixed'];

const Encryption = ({ radiusPrefix, editing }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}`, INTERFACE_SSID_ENCRYPTION_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`${namePrefix}`, undefined);
    }
  };

  const isEnabled = useMemo(() => getIn(values, `${namePrefix}`) !== undefined, [getIn(values, `${namePrefix}`)]);

  const isKeyNeeded = useMemo(
    () =>
      getIn(values, `${namePrefix}`) !== undefined &&
      keyProtos.includes(getIn(values, `${namePrefix}`).proto) &&
      getIn(values, `${radiusPrefix}`) === undefined,
    [getIn(values, `${namePrefix}`), getIn(values, `${radiusPrefix}`)],
  );

  return (
    <>
      <Heading size="md" display="flex" mt={6}>
        <Text mr={2}>Encryption</Text>
        <Switch
          onChange={onEnabledChange}
          isChecked={isEnabled}
          borderRadius="15px"
          size="lg"
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          isDisabled={!editing}
        />
      </Heading>
      {isEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <SelectField
            name={`${namePrefix}.proto`}
            label="protocol"
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
            isDisabled={!editing}
          />
          <SelectField
            name={`${namePrefix}.ieee80211w`}
            label="ieee80211w"
            definitionKey="interface.ssid.encryption.ieee80211w"
            options={[
              { value: 'disabled', label: 'disabled' },
              { value: 'optional', label: 'optional' },
              { value: 'required', label: 'required' },
            ]}
            isRequired
            isDisabled={!editing}
          />
          {isKeyNeeded && (
            <StringField
              name={`${namePrefix}.key`}
              label="key"
              definitionKey="interface.ssid.encryption.key"
              isRequired
              hideButton
              isDisabled={!editing}
            />
          )}
        </SimpleGrid>
      )}
    </>
  );
};

Encryption.propTypes = propTypes;
export default React.memo(Encryption);
