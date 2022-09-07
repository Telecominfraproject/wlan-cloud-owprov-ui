import React from 'react';
import { Flex, FormControl, FormLabel, Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import DisplayNumberField from 'components/DisplayFields/DisplayNumberField';
import DisplayObjectArrayField from 'components/DisplayFields/DisplayObjectArrayField';
import DisplaySelectField from 'components/DisplayFields/DisplaySelectField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import DisplayToggleField from 'components/DisplayFields/DisplayToggleField';
import StringField from 'components/FormFields/StringField';
import NumberField from 'components/FormFields/NumberField';
import { ENCRYPTION_OPTIONS, INTERFACE_SSID_RADIUS_LOCAL_USER_SCHEMA } from '../../interfacesConstants';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};

const LockedEncryption = ({ data }) => {
  if (!data) return null;

  return (
    <>
      <Flex mt={4}>
        <Heading size="md" borderBottom="1px solid">
          Authentication
        </Heading>
      </Flex>
      {data?.encryption?.proto !== undefined && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <DisplaySelectField
            label="protocol"
            value={data?.encryption?.proto}
            definitionKey="interface.ssid.encryption.proto"
            options={ENCRYPTION_OPTIONS}
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
          {data?.encryption?.ieee80211w !== undefined && (
            <DisplaySelectField
              label="ieee80211w"
              value={data?.encryption?.ieee80211w}
              definitionKey="interface.ssid.encryption.ieee80211w"
              options={[
                { value: 'disabled', label: 'disabled' },
                { value: 'optional', label: 'optional' },
                { value: 'required', label: 'required' },
              ]}
              isRequired
            />
          )}
        </SimpleGrid>
      )}
      {data?.radius && (
        <>
          <Flex mt={6}>
            <Heading size="md" display="flex" mt={2} mr={2} borderBottom="1px solid">
              Radius
            </Heading>
          </Flex>
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <DisplayStringField
              value={data?.radius?.authentication?.host}
              label="authentication.host"
              isDisabled
              isRequired
            />
            <DisplayNumberField
              value={data?.radius?.authentication?.port}
              label="authentication.port"
              isDisabled
              isRequired
              hideArrows
              w={24}
            />
            <DisplayStringField
              value={data?.radius?.authentication?.secret}
              label="authentication.secret"
              isDisabled
              isRequired
              hideButton
            />
            <DisplayToggleField value={data?.radius?.authentication?.['mac-filter']} isDisabled />
          </SimpleGrid>
          <FormControl isDisabled>
            <FormLabel ms="4px" fontSize="md" fontWeight="normal">
              Accounting
            </FormLabel>
          </FormControl>
          {data?.radius?.accounting && (
            <SimpleGrid minChildWidth="300px" spacing="20px">
              <DisplayStringField
                value={data?.radius?.accounting?.host}
                label="accounting.host"
                isDisabled
                isRequired
              />
              <DisplayNumberField
                value={data?.radius?.accounting?.port}
                label="accounting.port"
                isDisabled
                isRequired
                hideArrows
                w={24}
              />
              <DisplayStringField
                value={data?.radius?.accounting?.secret}
                label="accounting.secret"
                isDisabled
                isRequired
                hideButton
              />
            </SimpleGrid>
          )}
          <FormControl isDisabled>
            <FormLabel ms="4px" fontSize="md" fontWeight="normal">
              Accounting
            </FormLabel>
          </FormControl>
          {data?.radius?.['dynamic-authorization'] && (
            <SimpleGrid minChildWidth="300px" spacing="20px">
              <DisplayStringField
                value={data?.radius?.['dynamic-authorization']?.host}
                label="dynamic-authorization.host"
                isDisabled
                isRequired
              />
              <DisplayNumberField
                value={data?.radius?.['dynamic-authorization']?.port}
                label="dynamic-authorization.port"
                isDisabled
                isRequired
                hideArrows
                w={24}
              />
              <DisplayStringField
                value={data?.radius?.['dynamic-authorization']?.secret}
                label="dynamic-authorization.secret"
                isDisabled
                isRequired
                hideButton
              />
            </SimpleGrid>
          )}
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <DisplayStringField value={data?.radius?.['nas-identifier']} label="nas-identifier" isDisabled />
            <DisplayToggleField value={data?.radius?.['chargeable-user-id']} label="chargeable-user-id" isDisabled />
          </SimpleGrid>
          {data?.radius?.local && (
            <>
              <FormControl isDisabled>
                <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                  Local
                </FormLabel>
              </FormControl>
              <SimpleGrid minChildWidth="300px" spacing="20px">
                <DisplayStringField
                  value={data?.radius?.local?.['server-identity']}
                  label="server-identity"
                  isDisabled
                />
                <DisplayObjectArrayField
                  value={data?.radius?.local?.users}
                  label="radius.local.users"
                  definitionKey="interface.ssid.radius.local.users"
                  fields={
                    <SimpleGrid minChildWidth="300px" gap={4}>
                      <StringField name="mac" label="mac" isRequired />
                      <StringField name="user-name" label="user-name" isRequired />
                      <StringField name="password" label="password" isRequired hideButton />
                      <NumberField name="vlan-id" label="vlan-id" isRequired w={24} />
                    </SimpleGrid>
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
                  isDisabled
                  isRequired
                />
              </SimpleGrid>
            </>
          )}
        </>
      )}
    </>
  );
};

LockedEncryption.propTypes = propTypes;
export default React.memo(LockedEncryption);
