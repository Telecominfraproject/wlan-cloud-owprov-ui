import React from 'react';
import { Flex, FormControl, FormLabel, Heading, SimpleGrid, Switch } from '@chakra-ui/react';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import LockedRadius from './LockedRadius';
import Local from '../../Local';
import { INTERFACE_SSID_RADIUS_SCHEMA } from '../../../../interfacesConstants';

type Props = {
  editing: boolean;
  namePrefix: string;
  isUsingCustom: boolean;
  onAccountingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAccountingEnabled: boolean;
  onDynamicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDynamicEnabled: boolean;
  variableBlock?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  isPasspoint?: boolean;
};
const RadiusForm = ({
  editing,
  namePrefix,
  isUsingCustom,
  onAccountingChange,
  isAccountingEnabled,
  onDynamicChange,
  isDynamicEnabled,
  variableBlock,
}: Props) => (
  <>
    <Flex mt={6}>
      <div>
        <Heading size="md" display="flex" mt={2} mr={2} borderBottom="1px solid">
          Radius
        </Heading>
      </div>
      <ConfigurationResourcePicker
        name={namePrefix}
        prefix="interface.ssid.radius"
        isDisabled={!editing}
        defaultValue={INTERFACE_SSID_RADIUS_SCHEMA}
      />
    </Flex>
    {isUsingCustom || !variableBlock ? (
      <>
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <StringField
            name={`${namePrefix}.authentication.host`}
            label="authentication.host"
            isDisabled={!editing}
            isRequired
          />
          <NumberField
            name={`${namePrefix}.authentication.port`}
            label="authentication.port"
            isDisabled={!editing}
            isRequired
            hideArrows
            w={24}
          />
          <StringField
            name={`${namePrefix}.authentication.secret`}
            label="authentication.secret"
            isDisabled={!editing}
            isRequired
            hideButton
          />
          <ToggleField
            name={`${namePrefix}.authentication.mac-filter`}
            label="authentication.mac-filter"
            isDisabled={!editing}
            falseIsUndefined
          />
        </SimpleGrid>
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
            <StringField
              name={`${namePrefix}.accounting.host`}
              label="accounting.host"
              isDisabled={!editing}
              isRequired
            />
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
        <FormControl isDisabled={!editing}>
          <FormLabel ms="4px" fontSize="md" fontWeight="normal">
            Enable Dynamic Authorization
          </FormLabel>
          <Switch
            onChange={onDynamicChange}
            isChecked={isDynamicEnabled}
            borderRadius="15px"
            size="lg"
            isDisabled={!editing}
            _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          />
        </FormControl>
        {isDynamicEnabled && (
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={4}>
            <StringField
              name={`${namePrefix}.dynamic-authorization.host`}
              label="dynamic-authorization.host"
              isDisabled={!editing}
              isRequired
            />
            <NumberField
              name={`${namePrefix}.dynamic-authorization.port`}
              label="dynamic-authorization.port"
              isDisabled={!editing}
              isRequired
            />
            <StringField
              name={`${namePrefix}.dynamic-authorization.secret`}
              label="dynamic-authorization.secret"
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
        <Local editing={editing} namePrefix={`${namePrefix}.local`} />
      </>
    ) : (
      <LockedRadius variableBlockId={variableBlock} />
    )}
  </>
);

export default React.memo(RadiusForm);
