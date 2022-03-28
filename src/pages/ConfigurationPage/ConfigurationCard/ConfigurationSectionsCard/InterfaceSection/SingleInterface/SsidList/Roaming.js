import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext, getIn } from 'formik';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { INTERFACE_SSID_ROAMING_SCHEMA } from '../../interfacesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  namePrefix: PropTypes.string.isRequired,
};

const Roaming = ({ editing, namePrefix }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}`, INTERFACE_SSID_ROAMING_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`${namePrefix}`, undefined);
    }
  };

  const isEnabled = useMemo(() => getIn(values, `${namePrefix}`) !== undefined, [getIn(values, `${namePrefix}`)]);

  return (
    <>
      <Heading size="md" display="flex" mt={6}>
        <Text mr={2}>Roaming</Text>
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
          <StringField
            name={`${namePrefix}.message-exchange`}
            label="message-exchange"
            definitionKey="interface.ssid.roaming.message-exchange"
            isDisabled={!editing}
            isRequired
          />
          <ToggleField
            name={`${namePrefix}.generate-psk`}
            label="generate-psk"
            definitionKey="interface.ssid.roaming.generate-psk"
            isDisabled={!editing}
            isRequired
          />
          <StringField
            name={`${namePrefix}.domain-identifier`}
            label="domain-identifier"
            definitionKey="interface.ssid.roaming.domain-identifier"
            isDisabled={!editing}
            isRequired
          />
          <StringField
            name={`${namePrefix}.pmk-r0-key-holder`}
            label="pmk-r0-key-holder"
            definitionKey="interface.ssid.roaming.pmk-r0-key-holder"
            isDisabled={!editing}
            isRequired
          />
          <StringField
            name={`${namePrefix}.pmk-r1-key-holder`}
            label="pmk-r1-key-holder"
            definitionKey="interface.ssid.roaming.pmk-r1-key-holder"
            isDisabled={!editing}
            isRequired
          />
        </SimpleGrid>
      )}
    </>
  );
};

Roaming.propTypes = propTypes;
export default React.memo(Roaming);
