import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext, getIn } from 'formik';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { INTERFACE_SSID_ENCRYPTION_SCHEMA } from '../../interfacesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  namePrefix: PropTypes.string.isRequired,
  radiusPrefix: PropTypes.string.isRequired,
};

const keyProtos = ['psk', 'psk2', 'psk-mixed', 'sae-mixed'];

const Encryption = ({ editing, namePrefix, radiusPrefix }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}`, INTERFACE_SSID_ENCRYPTION_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`${namePrefix}`, undefined);
    }
  };

  const onProtoChange = useCallback(
    (e) => {
      const value = getIn(values, `${namePrefix}`);
      if (e.target.value === 'none') {
        setFieldValue(`${namePrefix}`, { proto: 'none' });
      } else if (value && value.proto === 'none') {
        setFieldValue(`${namePrefix}`, { proto: e.target.value, ieee80211w: 'disabled', key: 'YOUR_SECRET' });
      } else {
        setFieldValue(`${namePrefix}.proto`, e.target.value);
      }
    },
    [getIn(values, `${namePrefix}`)],
  );

  const isEnabled = useMemo(() => getIn(values, `${namePrefix}`) !== undefined, [getIn(values, `${namePrefix}`)]);

  const canChangeIeee = useMemo(() => {
    const configValue = getIn(values, `${namePrefix}`);

    return configValue && configValue.proto && configValue.proto !== 'none';
  }, [getIn(values, `${namePrefix}`)]);

  const isKeyNeeded = useMemo(() => {
    const value = getIn(values, `${namePrefix}`);
    const radiusValue = getIn(values, `${radiusPrefix}`);

    return value !== undefined && keyProtos.includes(value.proto) && radiusValue === undefined;
  }, [getIn(values, `${namePrefix}`), getIn(values, `${radiusPrefix}`)]);

  return (
    <>
      <Heading size="md" display="flex" mt={6}>
        <Text mr={2}>Encryption</Text>
        <Switch
          onChange={onEnabledChange}
          isChecked={isEnabled}
          borderRadius="15px"
          size="lg"
          isDisabled={!editing}
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        />
      </Heading>
      {isEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <SelectField
            name={`${namePrefix}.proto`}
            label="protocol"
            definitionKey="interface.ssid.encryption.proto"
            options={[
              { value: 'none', label: t('common.none') },
              { value: 'psk', label: 'WPA-PSK' },
              { value: 'psk2', label: 'WPA2-PSK' },
              { value: 'psk-mixed', label: 'WPA-PSK/WPA2-PSK Personal Mixed' },
              { value: 'wpa2', label: 'WPA2-Enterprise EAP-TLS' },
              { value: 'sae-mixed', label: 'WPA2/WPA3 Transitional' },
              { value: 'wpa3', label: 'WPA3-Enterprise EAP-TLS' },
              { value: 'wpa3-192', label: 'WPA3-192-Enterprise EAP-TLS' },
            ]}
            isDisabled={!editing}
            isRequired
            onChange={onProtoChange}
          />
          {canChangeIeee && (
            <SelectField
              name={`${namePrefix}.ieee80211w`}
              label="ieee80211w"
              definitionKey="interface.ssid.encryption.ieee80211w"
              options={[
                { value: 'disabled', label: 'disabled' },
                { value: 'optional', label: 'optional' },
                { value: 'required', label: 'required' },
              ]}
              isDisabled={!editing}
              isRequired
            />
          )}
          {isKeyNeeded && (
            <StringField
              name={`${namePrefix}.key`}
              label="key"
              definitionKey="interface.ssid.encryption.key"
              isDisabled={!editing}
              isRequired
              hideButton
            />
          )}
        </SimpleGrid>
      )}
    </>
  );
};

Encryption.propTypes = propTypes;
export default React.memo(Encryption);
