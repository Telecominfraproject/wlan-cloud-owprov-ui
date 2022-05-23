import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext, getIn } from 'formik';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import {
  ENCRYPTION_OPTIONS,
  ENCRYPTION_PROTOS_REQUIRE_IEEE,
  ENCRYPTION_PROTOS_REQUIRE_KEY,
  INTERFACE_SSID_ENCRYPTION_SCHEMA,
} from '../../interfacesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  namePrefix: PropTypes.string.isRequired,
  radiusPrefix: PropTypes.string.isRequired,
};

const Encryption = ({ editing, namePrefix, radiusPrefix }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const encryptionValue = useMemo(() => getIn(values, namePrefix), [getIn(values, namePrefix)]);
  const radiusValue = useMemo(() => getIn(values, radiusPrefix), [getIn(values, radiusPrefix)]);

  const onEnabledChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}`, INTERFACE_SSID_ENCRYPTION_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`${namePrefix}`, undefined);
    }
  };

  const onProtoChange = useCallback(
    (e) => {
      const value = encryptionValue;
      if (e.target.value === 'none') {
        setFieldValue(`${namePrefix}`, { proto: 'none' });
      } else if (value && value.proto === 'none') {
        setFieldValue(`${namePrefix}`, { proto: e.target.value, ieee80211w: 'disabled', key: 'YOUR_SECRET' });
      } else {
        setFieldValue(`${namePrefix}.proto`, e.target.value);
      }
    },
    [encryptionValue],
  );

  const needIeee = useMemo(
    () => encryptionValue && ENCRYPTION_PROTOS_REQUIRE_IEEE.includes(encryptionValue.proto),
    [encryptionValue],
  );

  const canChangeIeee = useMemo(
    () => encryptionValue && encryptionValue.proto && encryptionValue.proto !== 'none',
    [encryptionValue],
  );

  const isKeyNeeded = useMemo(
    () =>
      encryptionValue !== undefined &&
      ENCRYPTION_PROTOS_REQUIRE_KEY.includes(encryptionValue.proto) &&
      radiusValue === undefined,
    [encryptionValue, radiusValue],
  );

  return (
    <>
      <Heading size="md" display="flex" mt={6}>
        <Text mr={2}>Encryption</Text>
        <Switch
          onChange={onEnabledChange}
          isChecked={encryptionValue !== undefined}
          borderRadius="15px"
          size="lg"
          isDisabled={!editing}
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        />
      </Heading>
      {encryptionValue !== undefined && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <SelectField
            name={`${namePrefix}.proto`}
            label="protocol"
            definitionKey="interface.ssid.encryption.proto"
            options={ENCRYPTION_OPTIONS}
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
              isRequired={needIeee}
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
