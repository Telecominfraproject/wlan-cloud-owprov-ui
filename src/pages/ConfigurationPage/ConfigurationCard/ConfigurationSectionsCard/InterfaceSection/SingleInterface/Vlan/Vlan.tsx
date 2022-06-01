import React from 'react';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import NumberField from 'components/FormFields/NumberField';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import { ObjectShape } from 'yup/lib/object';
import LockedVlan from './LockedVlan';

interface Props {
  editing: boolean;
  isActive: boolean;
  index: number;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUsingCustom: boolean;
  variableBlock?: string;
  basicSchema: (t: (s: string) => string) => ObjectShape;
}

const VlanForm: React.FC<Props> = ({
  editing,
  index,
  isActive,
  onToggle,
  isUsingCustom,
  variableBlock,
  basicSchema,
}) => (
  <>
    <Heading size="md" display="flex">
      <Text pt={1}>Vlan</Text>
      <Switch
        pt={1}
        onChange={onToggle}
        isChecked={isActive}
        borderRadius="15px"
        size="lg"
        mx={2}
        isDisabled={!editing}
      />
      {isActive && (
        <ConfigurationResourcePicker
          name={`configuration[${index}].vlan`}
          prefix="interface.vlan"
          isDisabled={!editing}
          defaultValue={basicSchema}
        />
      )}
    </Heading>
    {isActive && isUsingCustom && (
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <NumberField name={`configuration[${index}].vlan.id`} label="id" isDisabled={!editing} isRequired w={36} />
      </SimpleGrid>
    )}
    {isActive && !isUsingCustom && variableBlock !== undefined && <LockedVlan variableBlockId={variableBlock} />}
  </>
);

export default React.memo(VlanForm);
