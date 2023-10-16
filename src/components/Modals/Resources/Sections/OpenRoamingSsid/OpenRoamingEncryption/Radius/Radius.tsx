import React from 'react';
import { Flex, FormControl, FormLabel, Heading, SimpleGrid, Switch } from '@chakra-ui/react';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';

type Props = {
  editing: boolean;
  namePrefix: string;
  onAccountingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAccountingEnabled: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  isPasspoint?: boolean;
};
const OpenRoamingRadiusForm = ({ editing, namePrefix, onAccountingChange, isAccountingEnabled }: Props) => (
  <>
    <Flex mt={6}>
      <div>
        <Heading size="md" display="flex" mt={2} mr={2} borderBottom="1px solid">
          Radius
        </Heading>
      </div>
    </Flex>
    <FormControl isDisabled={!editing}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal">
        Enable Accounting
      </FormLabel>
      <Switch
        onChange={onAccountingChange}
        isChecked={isAccountingEnabled}
        borderRadius="15px"
        size="lg"
        isDisabled={!editing}
        _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
      />
    </FormControl>
    {isAccountingEnabled && (
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <StringField name={`${namePrefix}.accounting.host`} label="accounting.host" isDisabled={!editing} isRequired />
        <NumberField
          name={`${namePrefix}.accounting.port`}
          label="accounting.port"
          isDisabled={!editing}
          isRequired
          hideArrows
          w={24}
        />
        <StringField
          name={`${namePrefix}.accounting.secret`}
          label="accounting.secret"
          isDisabled={!editing}
          isRequired
          hideButton
        />
      </SimpleGrid>
    )}
    <SimpleGrid minChildWidth="300px" spacing="20px">
      <StringField
        name={`${namePrefix}.nas-identifier`}
        label="nas-identifier"
        isDisabled={!editing}
        emptyIsUndefined
      />
      <ToggleField
        name={`${namePrefix}.chargeable-user-id`}
        label="chargeable-user-id"
        isDisabled={!editing}
        falseIsUndefined
      />
    </SimpleGrid>
  </>
);

export default React.memo(OpenRoamingRadiusForm);
