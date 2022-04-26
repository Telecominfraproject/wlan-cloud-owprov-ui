import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useGetResource } from 'hooks/Network/Resources';
import { useTranslation } from 'react-i18next';
import { SimpleGrid, useToast } from '@chakra-ui/react';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import DisplayNumberField from 'components/DisplayFields/DisplayNumberField';
import DisplayToggleField from 'components/DisplayFields/DisplayToggleField';
import DisplaySelectField from 'components/DisplayFields/DisplaySelectField';
import DisplayMultiSelectField from 'components/DisplayFields/DisplayMultiSelectField';
import LockedEncryption from './LockedEncryption';

const propTypes = {
  variableBlockId: PropTypes.string.isRequired,
};

const LockedRadius = ({ variableBlockId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: resource } = useGetResource({
    t,
    toast,
    id: variableBlockId,
    enabled: true,
  });

  const data = useMemo(() => {
    if (resource && resource.variables[0]) {
      return JSON.parse(resource.variables[0].value);
    }
    return null;
  }, [resource]);

  if (!data) return null;

  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <DisplayStringField value={data.name} label="name" definitionKey="interface.ssid.name" isRequired />
        <DisplaySelectField
          value={data['bss-mode']}
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
        <DisplayMultiSelectField
          value={data['wifi-bands']}
          label="wifi-bands"
          definitionKey="interface.ssid.wifi-bands"
          options={[
            { value: '2G', label: '2G' },
            { value: '5G', label: '5G' },
          ]}
          isRequired
        />
        <DisplayToggleField
          value={data['hidden-ssid']}
          label="hidden-ssid"
          definitionKey="interface.ssid.hidden-ssid"
          isRequired
        />
        <DisplayMultiSelectField
          value={data.services}
          label="services"
          definitionKey="interface.ssid.services"
          options={[
            { value: 'wifi-steering', label: 'wifi-steering' },
            { value: 'dhcp-snooping', label: 'dhcp-snooping' },
          ]}
        />
        <DisplayNumberField
          value={data['maximum-clients']}
          label="maximum-clients"
          definitionKey="interface.ssid.maximum-clients"
          isRequired
        />
        <DisplaySelectField
          value={data.purpose}
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
        <DisplayToggleField
          value={data['isolate-clients']}
          label="isolate-clients"
          definitionKey="interface.ssid.isolate-clients"
          isRequired
          falseIsUndefined
        />
        <DisplayToggleField
          value={data['power-save']}
          label="power-save"
          definitionKey="interface.ssid.power-save"
          falseIsUndefined
        />
        <DisplayToggleField
          value={data['broadcast-time']}
          label="broadcast-time"
          definitionKey="interface.ssid.broadcast-time"
          falseIsUndefined
        />
        <DisplayToggleField
          value={data['unicast-conversion']}
          label="unicast-conversion"
          definitionKey="interface.ssid.unicast-conversion"
          falseIsUndefined
        />
        <DisplayToggleField
          value={data['proxy-arp']}
          label="proxy-arp"
          definitionKey="interface.ssid.proxy-arp"
          falseIsUndefined
        />
        <DisplayToggleField
          value={data['disassoc-low-ack']}
          label="disassoc-low-ack"
          definitionKey="interface.ssid.disassoc-low-ack"
          falseIsUndefined
        />
        <DisplayStringField
          value={data['vendor-elements']}
          label="vendor-elements"
          definitionKey="interface.ssid.vendor-elements"
          emptyIsUndefined
        />
      </SimpleGrid>
      <LockedEncryption data={data} />
    </>
  );
};

LockedRadius.propTypes = propTypes;
export default React.memo(LockedRadius);
