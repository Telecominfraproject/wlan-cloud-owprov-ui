import React from 'react';
import { FormControl, Heading, Select, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import { INTERFACE_TUNNEL_SCHEMA } from '../../interfacesConstants';
import LockedTunnel from './LockedTunnel';
import TunnelValues from './TunnelValues';

interface Props {
  isDisabled?: boolean;
  namePrefix: string;
  value?: boolean;
  onToggle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProtoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  protoValue?: string;
  variableBlockId?: string;
}

const TunnelForm: React.FC<Props> = ({
  isDisabled,
  namePrefix,
  value,
  onToggle,
  onProtoChange,
  protoValue,
  variableBlockId,
}) => (
  <>
    <Heading size="md" display="flex">
      <Text pt={1}>Tunnel</Text>
      {onToggle !== undefined && (
        <Switch
          onChange={onToggle}
          isChecked={value !== undefined}
          borderRadius="15px"
          size="lg"
          isDisabled={isDisabled}
          pt={1}
          mx={2}
        />
      )}
      {onToggle !== undefined && value !== undefined && (
        <ConfigurationResourcePicker
          name={namePrefix}
          prefix="interface.tunnel"
          isDisabled={isDisabled ?? false}
          defaultValue={INTERFACE_TUNNEL_SCHEMA}
        />
      )}
      {!variableBlockId && (
        <FormControl isDisabled={isDisabled} hidden={value === undefined} ml={2}>
          <Select value={protoValue ?? ''} onChange={onProtoChange} borderRadius="15px" fontSize="sm" w="120px">
            <option value="mesh">mesh</option>
            <option value="vxlan">vxlan</option>
            <option value="l2tp">l2tp</option>
            <option value="gre">gre</option>
          </Select>
        </FormControl>
      )}
    </Heading>
    {variableBlockId ? (
      <LockedTunnel variableBlockId={variableBlockId} />
    ) : (
      <SimpleGrid minChildWidth="200px" spacing="20px" mb={protoValue !== '' ? 8 : undefined} mt={2} w="100%">
        <TunnelValues namePrefix={namePrefix} type={protoValue ?? ''} isDisabled={isDisabled} />
      </SimpleGrid>
    )}
  </>
);
export default React.memo(TunnelForm);
