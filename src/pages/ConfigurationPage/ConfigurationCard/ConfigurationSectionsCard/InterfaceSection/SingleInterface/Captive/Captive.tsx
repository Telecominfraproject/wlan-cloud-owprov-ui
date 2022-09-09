import React from 'react';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';
import LockedCaptive from './LockedCaptive';
import { INTERFACE_CAPTIVE_SCHEMA } from '../../interfacesConstants';

interface Props {
  isDisabled?: boolean;
  isActive: boolean;
  namePrefix: string;
  onToggle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variableBlockId?: string;
}

const CaptiveForm: React.FC<Props> = ({ isDisabled, namePrefix, isActive, onToggle, variableBlockId }) => (
  <>
    <Heading size="md" display="flex">
      <Text pt={1}>Captive Portal</Text>
      {onToggle !== undefined && (
        <Switch
          pt={1}
          onChange={onToggle}
          isChecked={isActive}
          borderRadius="15px"
          size="lg"
          mx={2}
          isDisabled={isDisabled}
        />
      )}
      {onToggle !== undefined && isActive && (
        <ConfigurationResourcePicker
          name={namePrefix}
          prefix="interface.captive"
          isDisabled={isDisabled ?? false}
          defaultValue={INTERFACE_CAPTIVE_SCHEMA}
        />
      )}
    </Heading>
    {variableBlockId !== undefined && <LockedCaptive variableBlockId={variableBlockId} />}
    {variableBlockId === undefined && isActive && (
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <StringField
          name={`${namePrefix}.gateway-name`}
          label="gateway-name"
          isDisabled={isDisabled}
          emptyIsUndefined
        />
        <StringField
          name={`${namePrefix}.gateway-fqdn`}
          label="gateway-fqdn"
          isDisabled={isDisabled}
          emptyIsUndefined
        />
        <NumberField
          name={`${namePrefix}.max-clients`}
          label="max-clients"
          isDisabled={isDisabled}
          acceptEmptyValue
          w={36}
        />
        <NumberField
          name={`${namePrefix}.upload-rate`}
          label="upload-rate"
          isDisabled={isDisabled}
          acceptEmptyValue
          w={36}
        />
        <NumberField
          name={`${namePrefix}.download-rate`}
          label="download-rate"
          isDisabled={isDisabled}
          acceptEmptyValue
          w={36}
        />
        <NumberField
          name={`${namePrefix}.upload-quota`}
          label="upload-quota"
          isDisabled={isDisabled}
          acceptEmptyValue
          w={36}
        />
        <NumberField
          name={`${namePrefix}.download-quota`}
          label="download-quota"
          acceptEmptyValue
          isDisabled={isDisabled}
          w={36}
        />
      </SimpleGrid>
    )}
  </>
);

export default React.memo(CaptiveForm);
