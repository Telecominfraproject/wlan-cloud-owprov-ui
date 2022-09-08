import React from 'react';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';

interface Props {
  editing: boolean;
  namePrefix: string;
  isEnabled: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoamingForm: React.FC<Props> = ({ editing, namePrefix, isEnabled, onToggle }) => (
  <>
    <Heading size="md" display="flex" mt={4}>
      <Text mr={2}>Roaming</Text>
      <Switch
        onChange={onToggle}
        isChecked={isEnabled}
        borderRadius="15px"
        size="lg"
        _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        isDisabled={!editing}
      />
    </Heading>
    {isEnabled && (
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <StringField
          name={`${namePrefix}.message-exchange`}
          label="message-exchange"
          definitionKey="interface.ssid.roaming.message-exchange"
          isDisabled={!editing}
          isRequired
        />
        <ToggleField
          name={`${namePrefix}.generate-psk`}
          label="generate-psk"
          definitionKey="interface.ssid.roaming.generate-psk"
          isDisabled={!editing}
          isRequired
        />
        <StringField
          name={`${namePrefix}.domain-identifier`}
          label="domain-identifier"
          definitionKey="interface.ssid.roaming.domain-identifier"
          isDisabled={!editing}
          emptyIsUndefined
        />
        <StringField
          name={`${namePrefix}.pmk-r0-key-holder`}
          label="pmk-r0-key-holder"
          definitionKey="interface.ssid.roaming.pmk-r0-key-holder"
          isDisabled={!editing}
          emptyIsUndefined
        />
        <StringField
          name={`${namePrefix}.pmk-r1-key-holder`}
          label="pmk-r1-key-holder"
          definitionKey="interface.ssid.roaming.pmk-r1-key-holder"
          isDisabled={!editing}
          emptyIsUndefined
        />
      </SimpleGrid>
    )}
  </>
);

export default React.memo(RoamingForm);
