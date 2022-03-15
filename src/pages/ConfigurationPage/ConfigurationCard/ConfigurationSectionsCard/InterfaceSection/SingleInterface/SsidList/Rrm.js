import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext, getIn } from 'formik';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { INTERFACE_SSID_RRM_SCHEMA } from '../../interfacesConstants';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  namePrefix: PropTypes.string.isRequired,
};

const Rrm = ({ editing, namePrefix }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}`, INTERFACE_SSID_RRM_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`${namePrefix}`, undefined);
    }
  };

  const isEnabled = useMemo(
    () => getIn(values, `${namePrefix}`) !== undefined,
    [getIn(values, `${namePrefix}`)],
  );

  return (
    <>
      <Heading size="md" display="flex" mt={6}>
        <Text mr={2}>RRM</Text>
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
          <ToggleField
            name={`${namePrefix}.neighbor-reporting`}
            label="neighbor-reporting"
            definitionKey="interface.ssid.rrm.neighbor-reporting"
            isDisabled={!editing}
            isRequired
          />
          <StringField
            name={`${namePrefix}.lci`}
            label="lci"
            definitionKey="interface.ssid.rrm.lci"
            isDisabled={!editing}
            isRequired
          />
          <StringField
            name={`${namePrefix}.civic-location`}
            label="civic-location"
            definitionKey="interface.ssid.rrm.civic-location"
            isDisabled={!editing}
            isRequired
          />
          <ToggleField
            name={`${namePrefix}.ftm-responder`}
            label="ftm-responder"
            definitionKey="interface.ssid.rrm.ftm-responder"
            isDisabled={!editing}
            isRequired
          />
          <ToggleField
            name={`${namePrefix}.stationary-ap`}
            label="stationary-ap"
            definitionKey="interface.ssid.rrm.stationary-ap"
            isDisabled={!editing}
            isRequired
          />
        </SimpleGrid>
      )}
    </>
  );
};

Rrm.propTypes = propTypes;
export default React.memo(Rrm);
