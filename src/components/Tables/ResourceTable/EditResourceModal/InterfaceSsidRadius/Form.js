import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useFormikContext, getIn } from 'formik';
import StringField from 'components/FormFields/StringField';
import NumberField from 'components/FormFields/NumberField';
import { FormControl, FormLabel, Heading, SimpleGrid, Switch } from '@chakra-ui/react';
import ToggleField from 'components/FormFields/ToggleField';
import ObjectArrayFieldModal from 'components/FormFields/ObjectArrayFieldModal';
import { INTERFACE_SSID_RADIUS_LOCAL_SCHEMA, INTERFACE_SSID_RADIUS_LOCAL_USER_SCHEMA } from './schemas';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};
const InterfaceSsidRadiusForm = ({ editing }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledAccountingChange = (e) => {
    if (e.target.checked) {
      setFieldValue('accounting', {
        host: '192.168.178.192',
        port: 1813,
        secret: '',
      });
    } else {
      setFieldValue('accounting', undefined);
    }
  };

  const isAccountingEnabled = useMemo(() => getIn(values, 'accounting') !== undefined, [getIn(values, 'accounting')]);

  const onEnableDynamicChange = (e) => {
    if (e.target.checked) {
      setFieldValue('dynamic-authorization', {
        host: '192.168.178.192',
        port: 1814,
        secret: '',
      });
    } else {
      setFieldValue('dynamic-authorization', undefined);
    }
  };

  const isDynamicEnabled = useMemo(
    () => getIn(values, 'dynamic-authorization') !== undefined,
    [getIn(values, 'dynamic-authorization')],
  );

  const onLocalEnabled = (e) => {
    if (e.target.checked) {
      setFieldValue('local', INTERFACE_SSID_RADIUS_LOCAL_SCHEMA(t, true).cast());
    } else {
      setFieldValue('local', undefined);
    }
  };

  const isLocalEnabled = useMemo(() => getIn(values, 'local') !== undefined, [getIn(values, 'local')]);

  return (
    <>
      <Heading size="md" mt={6} mb={2} textDecoration="underline">
        interface.ssid.radius
      </Heading>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <StringField name="authentication.host" label="authentication.host" isRequired isDisabled={!editing} />
        <NumberField
          name="authentication.port"
          label="authentication.port"
          isRequired
          hideArrows
          w={24}
          isDisabled={!editing}
        />
        <StringField
          name="authentication.secret"
          label="authentication.secret"
          isRequired
          hideButton
          isDisabled={!editing}
        />
        <ToggleField
          name="authentication.mac-filter"
          label="authentication.mac-filter"
          falseIsUndefined
          isDisabled={!editing}
        />
      </SimpleGrid>
      <FormControl>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          Enable Accounting
        </FormLabel>
        <Switch
          onChange={onEnabledAccountingChange}
          isChecked={isAccountingEnabled}
          borderRadius="15px"
          size="lg"
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          isDisabled={!editing}
        />
      </FormControl>
      {isAccountingEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <StringField name="accounting.host" label="accounting.host" isRequired isDisabled={!editing} />
          <NumberField
            name="accounting.port"
            label="accounting.port"
            isRequired
            hideArrows
            w={24}
            isDisabled={!editing}
          />
          <StringField name="accounting.secret" label="accounting.secret" isRequired hideButton isDisabled={!editing} />
        </SimpleGrid>
      )}
      <FormControl>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          Enable Dynamic Authorization
        </FormLabel>
        <Switch
          onChange={onEnableDynamicChange}
          isChecked={isDynamicEnabled}
          borderRadius="15px"
          size="lg"
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          isDisabled={!editing}
        />
      </FormControl>
      {isDynamicEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={4}>
          <StringField
            name="dynamic-authorization.host"
            label="dynamic-authorization.host"
            isRequired
            isDisabled={!editing}
          />
          <NumberField
            name="dynamic-authorization.port"
            label="dynamic-authorization.port"
            isRequired
            isDisabled={!editing}
          />
          <StringField
            name="dynamic-authorization.secret"
            label="dynamic-authorization.secret"
            isRequired
            hideButton
            isDisabled={!editing}
          />
        </SimpleGrid>
      )}
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <StringField name="nas-identifier" label="nas-identifier" isDisabled={!editing} />
        <ToggleField name="chargeable-user-id" label="chargeable-user-id" isDisabled={!editing} />
      </SimpleGrid>
      <FormControl>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          Enable Local
        </FormLabel>
        <Switch
          onChange={onLocalEnabled}
          isChecked={isLocalEnabled}
          borderRadius="15px"
          size="lg"
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          isDisabled={!editing}
        />
      </FormControl>
      {isLocalEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <StringField name="local.server-identity" label="server-identity" isRequired isDisabled={!editing} />
          <ObjectArrayFieldModal
            name="local.users"
            label="users"
            editing={editing}
            fields={
              <>
                <StringField name="mac" label="mac" isRequired />
                <StringField name="user-name" label="user-name" isRequired />
                <StringField name="password" label="password" isRequired hideButton />
                <NumberField name="vlan-id" label="vlan-id" isRequired w={24} />
              </>
            }
            columns={[
              {
                id: 'user-name',
                Header: 'user-name',
                Footer: '',
                accessor: 'user-name',
              },
              {
                id: 'mac',
                Header: 'mac',
                Footer: '',
                accessor: 'mac',
                customWidth: '150px',
              },
              {
                id: 'vlan-id',
                Header: 'vlan-id',
                Footer: '',
                accessor: 'vlan-id',
                customWidth: '100px',
              },
            ]}
            schema={INTERFACE_SSID_RADIUS_LOCAL_USER_SCHEMA}
            isRequired
          />
        </SimpleGrid>
      )}
    </>
  );
};

InterfaceSsidRadiusForm.propTypes = propTypes;

export default React.memo(InterfaceSsidRadiusForm);
