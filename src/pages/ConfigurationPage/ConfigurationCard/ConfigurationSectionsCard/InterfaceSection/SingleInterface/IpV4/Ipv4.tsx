import React, { useMemo } from 'react';
import { Box, FormControl, Heading, Select, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import ObjectArrayFieldModal, { ObjectArrayFieldModalOptions } from 'components/FormFields/ObjectArrayFieldModal';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import { PortRangeField } from 'components/FormFields/PortRangeField';
import StaticIpV4 from './StaticIpV4';
import LockedIpv4 from './LockedIpv4';
import { INTERFACE_IPV4_PORT_FORWARD_SCHEMA, INTERFACE_IPV4_SCHEMA } from '../../interfacesConstants';

type Props = {
  isEnabled?: boolean;
  isDisabled?: boolean;
  namePrefix: string;
  ipv4: string;
  role: string;
  onToggle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  variableBlockId?: string;
};
const IpV4Form = ({ isEnabled, isDisabled, namePrefix, ipv4, role, onToggle, onChange, variableBlockId }: Props) => {
  const portFields = useMemo(
    () => (
      <>
        <Box mb={4}>
          <SelectField
            name="protocol"
            label="protocol"
            definitionKey="interface.ipv4.port-forward.protocol"
            options={[
              { value: 'any', label: 'any' },
              { value: 'tcp', label: 'tcp' },
              { value: 'udp', label: 'udp' },
            ]}
            w="100px"
            isRequired
          />
        </Box>
        <Box mb={4}>
          <PortRangeField name="external-port" label="external-port" isRequired />
        </Box>
        <SimpleGrid minChildWidth="380px" gap={4}>
          <PortRangeField name="internal-port" label="internal-port" isRequired />
          <StringField name="internal-address" label="internal-address" isRequired />
        </SimpleGrid>
      </>
    ),
    [],
  );
  const portCols = useMemo(
    () => [
      {
        id: 'protocol',
        Header: 'protocol',
        Footer: '',
        accessor: 'protocol',
        customWidth: '100px',
      },
      {
        id: 'external-port',
        Header: 'external-port',
        Footer: '',
        accessor: 'external-port',
      },
      {
        id: 'internal-port',
        Header: 'internal-port',
        Footer: '',
        accessor: 'internal-port',
      },
      {
        id: 'internal-address',
        Header: 'internal-address',
        Footer: '',
        accessor: 'internal-address',
        customWidth: '150px',
      },
    ],
    [],
  );
  const portOpts: ObjectArrayFieldModalOptions = useMemo(
    () => ({
      buttonLabel: 'IPv4 Port Forwarding',
      modalTitle: 'IPv4 Port Forwarding',
    }),
    [],
  );

  return (
    <>
      <Heading size="md" display="flex">
        <Text pt={1}>IpV4</Text>
        {onToggle !== undefined && (
          <Switch
            onChange={onToggle}
            isChecked={isEnabled}
            borderRadius="15px"
            size="lg"
            isDisabled={isDisabled}
            pt={1}
            mx={2}
          />
        )}
        {isEnabled && onToggle !== undefined && (
          <ConfigurationResourcePicker
            name={namePrefix}
            prefix="interface.ipv4"
            isDisabled={isDisabled ?? false}
            defaultValue={INTERFACE_IPV4_SCHEMA}
          />
        )}
        {variableBlockId === undefined && (
          <>
            <FormControl isDisabled={isDisabled} hidden={ipv4 === ''} w="120px" ml={2}>
              <Select value={ipv4} onChange={onChange} borderRadius="15px" fontSize="sm" w="120px">
                <option value="dynamic">dynamic</option>
                <option value="static">static</option>
              </Select>
            </FormControl>
            {!onToggle || (role === 'downstream' && ipv4 !== '') ? (
              <ObjectArrayFieldModal
                name={`${namePrefix}.port-forward`}
                label="port-forward"
                definitionKey="interface.ipv4.port-forward"
                fields={portFields}
                columns={portCols}
                schema={INTERFACE_IPV4_PORT_FORWARD_SCHEMA}
                isDisabled={isDisabled}
                options={portOpts}
                hideLabel
                isRequired
                emptyIsUndefined
              />
            ) : null}
          </>
        )}
      </Heading>
      {variableBlockId ? (
        <LockedIpv4 variableBlockId={variableBlockId} />
      ) : (
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={ipv4 === 'static' ? 8 : undefined} mt={2} w="100%">
          <StaticIpV4 namePrefix={namePrefix} isEnabled={ipv4 === 'static'} isDisabled={isDisabled} />
        </SimpleGrid>
      )}
    </>
  );
};
export default React.memo(IpV4Form);
