import React from 'react';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';

interface Props {
  editing: boolean;
  isActive: boolean;
  index: number;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VlanForm: React.FC<Props> = ({ editing, index, isActive, onToggle }) => (
  <>
    <Heading size="md" display="flex">
      <Text pt={1}>Captive Portal</Text>
      <Switch
        pt={1}
        onChange={onToggle}
        isChecked={isActive}
        borderRadius="15px"
        size="lg"
        mx={2}
        isDisabled={!editing}
      />
    </Heading>
    {isActive && (
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <StringField
          name={`configuration[${index}].captive.gateway-name`}
          label="gateway-name"
          isDisabled={!editing}
          emptyIsUndefined
        />
        <StringField
          name={`configuration[${index}].captive.gateway-fqdn`}
          label="gateway-fqdn"
          isDisabled={!editing}
          emptyIsUndefined
        />
        <NumberField
          name={`configuration[${index}].captive.max-clients`}
          label="max-clients"
          isDisabled={!editing}
          acceptEmptyValue
          w={36}
        />
        <NumberField
          name={`configuration[${index}].captive.upload-rate`}
          label="upload-rate"
          isDisabled={!editing}
          acceptEmptyValue
          w={36}
        />
        <NumberField
          name={`configuration[${index}].captive.download-rate`}
          label="download-rate"
          isDisabled={!editing}
          acceptEmptyValue
          w={36}
        />
        <NumberField
          name={`configuration[${index}].captive.upload-quota`}
          label="upload-quota"
          isDisabled={!editing}
          acceptEmptyValue
          w={36}
        />
        <NumberField
          name={`configuration[${index}].captive.download-quota`}
          label="download-quota"
          acceptEmptyValue
          isDisabled={!editing}
          w={36}
        />
      </SimpleGrid>
    )}
  </>
);

export default React.memo(VlanForm);
