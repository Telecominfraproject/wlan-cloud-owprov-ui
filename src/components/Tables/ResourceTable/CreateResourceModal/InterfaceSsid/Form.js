import React from 'react';
import { useTranslation } from 'react-i18next';
import StringField from 'components/FormFields/StringField';
import NumberField from 'components/FormFields/NumberField';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import ToggleField from 'components/FormFields/ToggleField';
import SelectField from 'components/FormFields/SelectField';
import MultiSelectField from 'components/FormFields/MultiSelectField';
import Encryption from './Encryption';

const InterfaceSsidForm = () => {
  const { t } = useTranslation();

  return (
    <>
      <Heading size="md" mt={6} mb={2} textDecoration="underline">
        interface.ssid
      </Heading>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <StringField name="name" label="name" definitionKey="interface.ssid.name" isRequired />
        <SelectField
          name="bss-mode"
          label="bss-mode"
          definitionKey="interface.ssid.bss-mode"
          options={[
            { value: 'ap', label: 'ap' },
            { value: 'sta', label: 'sta' },
            { value: 'mesh', label: 'mesh' },
            { value: 'wds-ap', label: 'wds-ap' },
            { value: 'wds-sta', label: 'wds-sta' },
          ]}
          isRequired
        />
        <MultiSelectField
          name="wifi-bands"
          label="wifi-bands"
          definitionKey="interface.ssid.wifi-bands"
          options={[
            { value: '2G', label: '2G' },
            { value: '5G', label: '5G' },
          ]}
          isRequired
        />
        <ToggleField name="hidden-ssid" label="hidden-ssid" definitionKey="interface.ssid.hidden-ssid" isRequired />
        <MultiSelectField
          name="services"
          label="services"
          definitionKey="interface.ssid.services"
          options={[
            { value: 'wifi-steering', label: 'wifi-steering' },
            { value: 'dhcp-snooping', label: 'dhcp-snooping' },
          ]}
        />
        <NumberField
          name="maximum-clients"
          label="maximum-clients"
          definitionKey="interface.ssid.maximum-clients"
          isRequired
        />
        <SelectField
          name="purpose"
          label="purpose"
          definitionKey="interface.ssid.purpose"
          options={[
            { value: '', label: t('common.default') },
            { value: 'user-defined', label: 'user-defined' },
            { value: 'onboarding-ap', label: 'onboarding-ap' },
            { value: 'onboarding-sta', label: 'onboarding-sta' },
          ]}
          emptyIsUndefined
        />
        <ToggleField
          name="isolate-clients"
          label="isolate-clients"
          definitionKey="interface.ssid.isolate-clients"
          isRequired
          falseIsUndefined
        />
        <ToggleField name="power-save" label="power-save" definitionKey="interface.ssid.power-save" falseIsUndefined />
        <ToggleField
          name="broadcast-time"
          label="broadcast-time"
          definitionKey="interface.ssid.broadcast-time"
          falseIsUndefined
        />
        <ToggleField
          name="unicast-conversion"
          label="unicast-conversion"
          definitionKey="interface.ssid.unicast-conversion"
          falseIsUndefined
        />
        <ToggleField name="proxy-arp" label="proxy-arp" definitionKey="interface.ssid.proxy-arp" falseIsUndefined />
        <ToggleField
          name="disassoc-low-ack"
          label="disassoc-low-ack"
          definitionKey="interface.ssid.disassoc-low-ack"
          falseIsUndefined
        />
        <StringField
          name="vendor-elements"
          label="vendor-elements"
          definitionKey="interface.ssid.vendor-elements"
          emptyIsUndefined
        />
      </SimpleGrid>
      <Encryption namePrefix="encryption" radiusPrefix="radius" />
    </>
  );
};

export default React.memo(InterfaceSsidForm);
