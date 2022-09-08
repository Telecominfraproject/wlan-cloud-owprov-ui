import React, { useMemo } from 'react';
import { Box, FormControl, Heading, Select, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import ObjectArrayFieldModal, { ObjectArrayFieldModalOptions } from 'components/FormFields/ObjectArrayFieldModal';
import SelectField from 'components/FormFields/SelectField';
import { PortRangeField } from 'components/FormFields/PortRangeField';
import StringField from 'components/FormFields/StringField';
import { INTERFACE_IPV4_PORT_FORWARD_SCHEMA } from '../../interfacesConstants';
import StaticIpV4 from './StaticIpV4';

const IpV4Form: React.FC<{
  editing: boolean;
  index: number;
  ipv4: string;
  role: string;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ editing, index, ipv4, role, onToggle, onChange }) => {
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
        <Switch
          onChange={onToggle}
          isChecked={ipv4 !== ''}
          borderRadius="15px"
          size="lg"
          isDisabled={!editing}
          pt={1}
          mx={2}
        />
        <FormControl isDisabled={!editing} hidden={ipv4 === ''} w="120px">
          <Select value={ipv4} onChange={onChange} borderRadius="15px" fontSize="sm" w="120px">
            <option value="dynamic">dynamic</option>
            <option value="static">static</option>
          </Select>
        </FormControl>
        {role === 'downstream' && ipv4 !== '' && (
          <ObjectArrayFieldModal
            name={`configuration[${index}].ipv4.port-forward`}
            label="port-forward"
            definitionKey="interface.ipv4.port-forward"
            fields={portFields}
            columns={portCols}
            schema={INTERFACE_IPV4_PORT_FORWARD_SCHEMA}
            isDisabled={!editing}
            options={portOpts}
            hideLabel
            isRequired
            emptyIsUndefined
          />
        )}
      </Heading>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={ipv4 === 'static' ? 8 : undefined} mt={2} w="100%">
        <StaticIpV4 index={index} isEnabled={ipv4 === 'static'} editing={editing} />
      </SimpleGrid>
    </>
  );
};
export default React.memo(IpV4Form);
