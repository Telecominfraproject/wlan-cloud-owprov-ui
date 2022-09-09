import React, { useMemo } from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import DisplayNumberField from 'components/DisplayFields/DisplayNumberField';
import DisplayObjectArrayField from 'components/DisplayFields/DisplayObjectArrayField';
import DisplaySelectField from 'components/DisplayFields/DisplaySelectField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import DisplayToggleField from 'components/DisplayFields/DisplayToggleField';
import FastCreatableSelectInput from 'components/FormFields/CreatableSelectField/FastCreatableSelectInput';
import { ObjectArrayFieldModalOptions } from 'components/FormFields/ObjectArrayFieldModal';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import { useGetResource } from 'hooks/Network/Resources';
import { PortRangeField } from 'components/FormFields/PortRangeField';
import { INTERFACE_IPV4_PORT_FORWARD_SCHEMA } from '../../interfacesConstants';

const LockedIpv4 = ({ variableBlockId }: { variableBlockId?: string }) => {
  const { data: resource } = useGetResource({
    id: variableBlockId ?? '',
    enabled: variableBlockId !== undefined,
  });

  const data = useMemo(() => {
    if (resource && resource.variables[0]) {
      return JSON.parse(resource.variables[0].value);
    }
    return null;
  }, [resource]);

  const fieldProps = (suffix: string, nestedKey?: string) => ({
    name: suffix,
    label: `${suffix}${nestedKey ? `.${nestedKey}` : ''}`,
    value: nestedKey !== undefined ? data?.[suffix]?.[nestedKey] : data?.[suffix],
    definitionKey: `interface.ipv4.${suffix}${nestedKey !== undefined ? `.${nestedKey}` : ''}`,
    isDisabled: true,
  });

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

  if (!data) return null;

  return (
    <div>
      {data?.addressing === 'static' && (
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <DisplaySelectField
            w="120px"
            value={data?.addressing}
            label="addressing"
            options={[
              { value: 'static', label: 'static' },
              { value: 'static', label: 'dhcp' },
            ]}
          />
          {data?.['port-forward'] && (
            <DisplayObjectArrayField
              {...fieldProps('port-forward')}
              fields={portFields}
              columns={portCols}
              schema={INTERFACE_IPV4_PORT_FORWARD_SCHEMA}
              options={portOpts}
            />
          )}
          <DisplayStringField {...fieldProps('subnet')} />
          <DisplayStringField {...fieldProps('gateway')} />
          <DisplayToggleField {...fieldProps('send-hostname')} />
          {
            // @ts-ignore
            <FastCreatableSelectInput {...fieldProps('use-dns')} />
          }
          {data?.dhcp && (
            <>
              <DisplayNumberField {...fieldProps('dhcp', 'lease-first')} w={36} />
              <DisplayNumberField {...fieldProps('dhcp', 'lease-count')} w={36} />
              <DisplayStringField {...fieldProps('dhcp', 'lease-time')} />
              <DisplayStringField {...fieldProps('dhcp', 'relay-server')} />
              {data?.['dhcp-lease'] && (
                <>
                  <DisplayNumberField {...fieldProps('dhcp-lease', 'macaddr')} w={36} />
                  <DisplayNumberField {...fieldProps('dhcp-lease', 'lease-time')} w={36} />
                  <DisplayStringField {...fieldProps('dhcp-lease', 'static-lease-offset')} />
                  <DisplayToggleField {...fieldProps('dhcp-lease', 'publish-hostname')} />
                </>
              )}
            </>
          )}
        </SimpleGrid>
      )}
    </div>
  );
};

export default React.memo(LockedIpv4);
