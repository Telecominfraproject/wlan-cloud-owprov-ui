import React from 'react';
import { FormControl, Heading, Select, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import TunnelValues from './TunnelValues';

interface Props {
  editing: boolean;
  index: number;
  value?: boolean;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProtoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  protoValue?: string;
}

const TunnelForm: React.FC<Props> = ({ editing, index, value, onToggle, onProtoChange, protoValue }) => (
  <>
    <Heading size="md" display="flex">
      <Text pt={1}>Tunnel</Text>
      <Switch
        onChange={onToggle}
        isChecked={value !== undefined}
        borderRadius="15px"
        size="lg"
        isDisabled={!editing}
        pt={1}
        mx={2}
      />
      <FormControl isDisabled={!editing} hidden={value === undefined}>
        <Select value={protoValue ?? ''} onChange={onProtoChange} borderRadius="15px" fontSize="sm" w="120px">
          <option value="mesh">mesh</option>
          <option value="vxlan">vxlan</option>
          <option value="l2tp">l2tp</option>
          <option value="gre">gre</option>
        </Select>
      </FormControl>
    </Heading>
    <SimpleGrid minChildWidth="300px" spacing="20px" mb={protoValue !== '' ? 8 : undefined} mt={2} w="100%">
      <TunnelValues index={index} type={protoValue ?? ''} editing={editing} />
    </SimpleGrid>
  </>
);
export default React.memo(TunnelForm);
