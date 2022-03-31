import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext, getIn } from 'formik';
import StringField from 'components/FormFields/StringField';
import NumberField from 'components/FormFields/NumberField';
import { FormControl, FormLabel, Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import ToggleField from 'components/FormFields/ToggleField';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import Local from '../Local';
import { INTERFACE_SSID_RADIUS_SCHEMA } from '../../../interfacesConstants';
import LockedRadius from './LockedRadius';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  namePrefix: PropTypes.string.isRequired,
};

const Radius = ({ editing, namePrefix }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onRadiusEnabled = (e) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}`, INTERFACE_SSID_RADIUS_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`${namePrefix}`, undefined);
    }
  };

  const isRadiusEnabled = useMemo(() => getIn(values, `${namePrefix}`) !== undefined, [getIn(values, `${namePrefix}`)]);

  const isUsingCustomRadius = useMemo(() => {
    const v = getIn(values, `${namePrefix}`);
    return v !== undefined && v.__variableBlock === undefined;
  }, [getIn(values, `${namePrefix}`)]);

  const onEnabledAccountingChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}.accounting`, {
        host: '192.168.178.192',
        port: 1813,
        secret: 'YOUR_SECRET',
      });
    } else {
      setFieldValue(`${namePrefix}.accounting`, undefined);
    }
  };

  const isAccountingEnabled = useMemo(
    () => getIn(values, `${namePrefix}.accounting`) !== undefined,
    [getIn(values, `${namePrefix}`)],
  );

  const onEnableDynamicChange = (e) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}.dynamic-authorization`, {
        host: '192.168.178.192',
        port: 1813,
        secret: 'YOUR_SECRET',
      });
    } else {
      setFieldValue(`${namePrefix}.dynamic-authorization`, undefined);
    }
  };

  const isDynamicEnabled = useMemo(
    () => getIn(values, `${namePrefix}.dynamic-authorization`) !== undefined,
    [getIn(values, `${namePrefix}`)],
  );

  return (
    <>
      <Heading size="md" display="flex" mt={6}>
        <Text pt={1}>Radius</Text>
        <Switch
          pt={1}
          onChange={onRadiusEnabled}
          isChecked={isRadiusEnabled}
          borderRadius="15px"
          size="lg"
          isDisabled={!editing}
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          mx={2}
        />
        {isRadiusEnabled && (
          <ConfigurationResourcePicker
            name={namePrefix}
            prefix="interface.ssid.radius"
            isDisabled={!editing}
            defaultValue={INTERFACE_SSID_RADIUS_SCHEMA}
          />
        )}
      </Heading>
      {isUsingCustomRadius && (
        <>
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <StringField
              name={`${namePrefix}.authentication.host`}
              label="authentication.host"
              isDisabled={!editing}
              isRequired
            />
            <NumberField
              name={`${namePrefix}.authentication.port`}
              label="authentication.port"
              isDisabled={!editing}
              isRequired
              hideArrows
              w={24}
            />
            <StringField
              name={`${namePrefix}.authentication.secret`}
              label="authentication.secret"
              isDisabled={!editing}
              isRequired
              hideButton
            />
          </SimpleGrid>
          <FormControl isDisabled={!editing}>
            <FormLabel ms="4px" fontSize="md" fontWeight="normal">
              Enable Accounting
            </FormLabel>
            <Switch
              onChange={onEnabledAccountingChange}
              isChecked={isAccountingEnabled}
              borderRadius="15px"
              size="lg"
              isDisabled={!editing}
              _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
            />
          </FormControl>
          {isAccountingEnabled && (
            <SimpleGrid minChildWidth="300px" spacing="20px">
              <StringField
                name={`${namePrefix}.accounting.host`}
                label="accounting.host"
                isDisabled={!editing}
                isRequired
              />
              <NumberField
                name={`${namePrefix}.accounting.port`}
                label="accounting.port"
                isDisabled={!editing}
                isRequired
                hideArrows
                w={24}
              />
              <StringField
                name={`${namePrefix}.accounting.secret`}
                label="accounting.secret"
                isDisabled={!editing}
                isRequired
                hideButton
              />
            </SimpleGrid>
          )}
          <FormControl isDisabled={!editing}>
            <FormLabel ms="4px" fontSize="md" fontWeight="normal">
              Enable Dynamic Authorization
            </FormLabel>
            <Switch
              onChange={onEnableDynamicChange}
              isChecked={isDynamicEnabled}
              borderRadius="15px"
              size="lg"
              isDisabled={!editing}
              _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
            />
          </FormControl>
          {isDynamicEnabled && (
            <SimpleGrid minChildWidth="300px" spacing="20px" mb={4}>
              <StringField
                name={`${namePrefix}.dynamic-authorization.host`}
                label="dynamic-authorization.host"
                isDisabled={!editing}
                isRequired
              />
              <NumberField
                name={`${namePrefix}.dynamic-authorization.port`}
                label="dynamic-authorization.port"
                isDisabled={!editing}
                isRequired
              />
              <StringField
                name={`${namePrefix}.dynamic-authorization.secret`}
                label="dynamic-authorization.secret"
                isDisabled={!editing}
                isRequired
                hideButton
              />
            </SimpleGrid>
          )}
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <StringField
              name={`${namePrefix}.nas-identifier`}
              label="nas-identifier"
              isDisabled={!editing}
              emptyIsUndefined
            />
            <ToggleField
              name={`${namePrefix}.chargeable-user-id`}
              label="chargeable-user-id"
              isDisabled={!editing}
              falseIsUndefined
            />
          </SimpleGrid>
          <Local editing={editing} namePrefix={`${namePrefix}.local`} />
        </>
      )}
      {isRadiusEnabled && !isUsingCustomRadius && (
        <LockedRadius variableBlockId={getIn(values, `${namePrefix}.__variableBlock`)[0]} />
      )}
    </>
  );
};

Radius.propTypes = propTypes;
export default React.memo(Radius);
