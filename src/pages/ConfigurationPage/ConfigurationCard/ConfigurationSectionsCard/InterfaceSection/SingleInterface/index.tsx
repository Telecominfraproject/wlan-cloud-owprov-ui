import React, { useMemo } from 'react';
import { Flex, Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FieldArray } from 'formik';
import MultiSelectField from 'components/FormFields/MultiSelectField';
import ToggleField from 'components/FormFields/ToggleField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import ConfigurationSelectPortsField from 'components/CustomFields/ConfigurationSelectPortsField';
import useFastField from 'hooks/useFastField';
import DeleteButton from 'components/Buttons/DeleteButton';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import IpV4 from './IpV4';
import IpV6 from './IpV6';
import Vlan from './Vlan';
import SsidList from './SsidList';
import Tunnel from './Tunnel';
import Captive from './Captive';

interface Props {
  editing: boolean;
  index: number;
  remove: (e: number) => void;
}

const SingleInterface: React.FC<Props> = ({ editing, index, remove }) => {
  const { t } = useTranslation();
  const { value } = useFastField({ name: `configuration[${index}].ssids` });
  const removeRadio = () => remove(index);

  const roleOpts = useMemo(
    () => [
      { value: 'upstream', label: 'upstream' },
      { value: 'downstream', label: 'downstream' },
    ],
    [],
  );
  return (
    <>
      <Flex>
        <div>
          <Heading size="md" borderBottom="1px solid">
            General
          </Heading>
        </div>
        <Spacer />
        <DeleteButton isDisabled={!editing} onClick={removeRadio} label={t('configurations.delete_interface')} />
      </Flex>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <StringField
          name={`configuration[${index}].name`}
          label="name"
          definitionKey="interface.name"
          isDisabled={!editing}
          isRequired
        />
        <SelectField
          name={`configuration[${index}].role`}
          label="role"
          definitionKey="interface.role"
          isDisabled
          isRequired
          options={roleOpts}
        />
        <ConfigurationSelectPortsField
          name={`configuration[${index}].ethernet[0].select-ports`}
          isDisabled={!editing}
        />
        <ToggleField
          name={`configuration[${index}].isolate-hosts`}
          label="isolate-hosts"
          definitionKey="interface.isolate-hosts"
          isDisabled={!editing}
          falseIsUndefined
        />
        <MultiSelectField
          name={`configuration[${index}].services`}
          label="services"
          definitionKey="interface.services"
          options={[
            {
              value: 'airtime-policies',
              label: 'airtime-policies',
            },
            {
              value: 'data-plane',
              label: 'data-plane',
            },
            {
              value: 'http',
              label: 'http',
            },
            {
              value: 'ieee8021x',
              label: 'ieee8021x',
            },
            {
              value: 'igmp',
              label: 'igmp',
            },
            {
              value: 'http',
              label: 'http',
            },
            {
              value: 'lldp',
              label: 'lldp',
            },
            {
              value: 'log',
              label: 'log',
            },
            {
              value: 'mdns',
              label: 'mdns',
            },
            {
              value: 'ntp',
              label: 'ntp',
            },
            {
              value: 'online-check',
              label: 'online-check',
            },
            {
              value: 'open-flow',
              label: 'open-flow',
            },
            {
              value: 'quality-of-service',
              label: 'quality-of-service',
            },
            {
              value: 'radius-proxy',
              label: 'radius-proxy',
            },
            {
              value: 'rtty',
              label: 'rtty',
            },
            {
              value: 'ssh',
              label: 'ssh',
            },
            {
              value: 'wifi-steering',
              label: 'wifi-steering',
            },
          ]}
          isDisabled={!editing}
          emptyIsUndefined
        />
        <CreatableSelectField
          name={`configuration[${index}].hostapd-bss-raw`}
          label="hostapd-bss-raw"
          definitionKey="interface.hostapd-bss-raw"
          isDisabled={!editing}
          emptyIsUndefined
        />
      </SimpleGrid>
      <Flex mt={4} mb={2}>
        <Heading size="md" borderBottom="1px solid">
          IP Addressing
        </Heading>
      </Flex>
      <IpV4 editing={editing} index={index} />
      <IpV6 editing={editing} index={index} />
      <Flex mt={4} mb={2}>
        <Heading size="md" borderBottom="1px solid">
          Advanced Settings
        </Heading>
      </Flex>
      <Vlan editing={editing} index={index} />
      <Captive editing={editing} index={index} />
      <Tunnel editing={editing} index={index} />
      <FieldArray name={`configuration[${index}].ssids`}>
        {(arrayHelpers) => (
          <SsidList
            index={index}
            editing={editing}
            arrayHelpers={arrayHelpers}
            ssidsLength={value !== undefined ? value.length : 0}
          />
        )}
      </FieldArray>
    </>
  );
};

export default React.memo(SingleInterface);
