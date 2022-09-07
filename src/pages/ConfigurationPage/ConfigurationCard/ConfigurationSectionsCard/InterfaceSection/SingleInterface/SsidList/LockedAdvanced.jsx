import React, { useMemo } from 'react';
import { Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DisplayMultiSelectField from 'components/DisplayFields/DisplayMultiSelectField';
import DisplayNumberField from 'components/DisplayFields/DisplayNumberField';
import DisplayObjectArrayField from 'components/DisplayFields/DisplayObjectArrayField';
import DisplaySelectField from 'components/DisplayFields/DisplaySelectField';
import DisplayStringField from 'components/DisplayFields/DisplayStringField';
import DisplayToggleField from 'components/DisplayFields/DisplayToggleField';
import StringField from 'components/FormFields/StringField';
import NumberField from 'components/FormFields/NumberField';
import { INTERFACE_SSID_MULTIPSK_SCHEMA } from '../../interfacesConstants';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};

const LockedAdvanced = ({ data }) => {
  const { t } = useTranslation();

  const pskFields = useMemo(
    () => (
      <SimpleGrid minChildWidth="300px" gap={4}>
        <StringField name="mac" label="mac" emptyIsUndefined />
        <StringField name="key" label="key" isRequired />
        <NumberField name="vlan-id" label="vlan-id" isRequired />
      </SimpleGrid>
    ),
    [],
  );
  const pskCols = useMemo(
    () => [
      {
        id: 'mac',
        Header: 'mac',
        Footer: '',
        accessor: 'mac',
      },
      {
        id: 'key',
        Header: 'key',
        Footer: '',
        accessor: 'key',
        customWidth: '150px',
      },
      {
        id: 'vlan-id',
        Header: 'vlan-id',
        Footer: '',
        accessor: 'vlan-id',
        customWidth: '100px',
      },
    ],
    [],
  );
  if (!data) return null;

  return (
    <>
      <Flex mt={4}>
        <Heading size="md" borderBottom="1px solid">
          {t('configurations.advanced_settings')}
        </Heading>
      </Flex>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <DisplayToggleField
          value={data?.['hidden-ssid']}
          label="hidden-ssid"
          definitionKey="interface.ssid.hidden-ssid"
          isDisabled
        />
        <DisplayMultiSelectField
          value={data?.services}
          label="services"
          definitionKey="interface.ssid.services"
          options={[
            { value: 'radius-gw-proxy', label: 'radius-gw-proxy' },
            { value: 'wifi-steering', label: 'wifi-steering' },
            { value: 'dhcp-snooping', label: 'dhcp-snooping' },
          ]}
        />
        <DisplayNumberField
          value={data?.['maximum-clients']}
          label="maximum-clients"
          definitionKey="interface.ssid.maximum-clients"
        />
        <DisplayNumberField
          value={data?.['fils-discovery-interval']}
          label="fils-discovery-interval"
          definitionKey="interface.ssid.fils-discovery-interval"
        />
        <DisplaySelectField
          value={data?.purpose}
          label="purpose"
          options={[
            { value: '', label: t('common.default') },
            { value: 'user-defined', label: 'user-defined' },
            { value: 'onboarding-ap', label: 'onboarding-ap' },
            { value: 'onboarding-sta', label: 'onboarding-sta' },
          ]}
          definitionKey="interface.ssid.purpose"
        />
        <DisplayToggleField
          value={data?.['isolate-clients']}
          label="isolate-clients"
          definitionKey="interface.ssid.isolate-clients"
          isDisabled
        />
        <DisplayToggleField
          value={data?.['power-save']}
          label="power-save"
          definitionKey="interface.ssid.power-save"
          isDisabled
        />
        <DisplayToggleField
          value={data?.['broadcast-time']}
          label="broadcast-time"
          definitionKey="interface.ssid.broadcast-time"
          isDisabled
        />
        <DisplayToggleField
          value={data?.['unicast-conversion']}
          label="unicast-conversion"
          definitionKey="interface.ssid.unicast-conversion"
          isDisabled
        />
        <DisplayToggleField
          value={data?.['proxy-arp']}
          label="proxy-arp"
          definitionKey="interface.ssid.proxy-arp"
          isDisabled
        />
        <DisplayToggleField
          value={data?.['disassoc-low-ack']}
          label="disassoc-low-ack"
          definitionKey="interface.ssid.disassoc-low-ack"
          isDisabled
        />
        <DisplayStringField
          value={data?.['vendor-elements']}
          label="vendor-elements"
          definitionKey="interface.ssid.vendor-elements"
          isDisabled
        />
        <DisplayObjectArrayField
          value={data?.['multi-psk']}
          label="multi-psk"
          fields={pskFields}
          columns={pskCols}
          schema={INTERFACE_SSID_MULTIPSK_SCHEMA}
          isDisabled
          emptyIsUndefined
          isRequired
        />
      </SimpleGrid>
      {data?.['rate-limit'] && (
        <>
          <Heading size="md" display="flex">
            <Text mr={2}>Rate Limit</Text>
          </Heading>
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <DisplayNumberField
              value={data?.['rate-limit']?.['ingress-rate']}
              label="ingress-rate"
              definitionKey="interface.ssid.rate-limit.ingress-rate"
              unit="MB/s"
              isRequired
            />
            <DisplayNumberField
              value={data?.['rate-limit']?.['egress-rate']}
              label="egress-rate"
              definitionKey="interface.ssid.rate-limit.egress-rate"
              unit="MB/s"
              isRequired
            />
          </SimpleGrid>
        </>
      )}
      {data?.rrm && (
        <>
          <Heading size="md" display="flex" mt={4}>
            <Text mr={2}>RRM</Text>
          </Heading>
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <DisplayToggleField
              value={data?.rrm?.['neighbor-reporting']}
              label="neighbor-reporting"
              definitionKey="interface.ssid.rrm.neighbor-reporting"
              isDisabled
            />
            <DisplayStringField value={data?.rrm?.lci} label="lci" definitionKey="interface.ssid.rrm.lci" isDisabled />
            <DisplayStringField
              value={data?.rrm?.['civic-location']}
              label="civic-location"
              definitionKey="interface.ssid.rrm.civic-location"
              isDisabled
            />
            <DisplayToggleField
              value={data?.rrm?.['ftm-responder']}
              label="ftm-responder"
              definitionKey="interface.ssid.rrm.ftm-responder"
              isDisabled
            />
            <DisplayToggleField
              value={data?.rrm?.['stationary-ap']}
              label="stationary-ap"
              definitionKey="interface.ssid.rrm.stationary-ap"
              isDisabled
            />
          </SimpleGrid>
        </>
      )}
      {data?.roaming && (
        <>
          <Heading size="md" display="flex" mt={4}>
            <Text mr={2}>Roaming</Text>
          </Heading>
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <DisplayStringField
              value={data?.roaming?.['message-exchange']}
              label="message-exchange"
              definitionKey="interface.ssid.roaming.message-exchange"
              isDisabled
            />
            <DisplayToggleField
              value={data?.roaming?.['generate-psk']}
              label="generate-psk"
              definitionKey="interface.ssid.roaming.generate-psk"
              isDisabled
            />
            <DisplayStringField
              value={data?.roaming?.['domain-identifier']}
              label="domain-identifier"
              definitionKey="interface.ssid.roaming.domain-identifier"
              isDisabled
            />
            <DisplayStringField
              value={data?.roaming?.['pmk-r0-key-holder']}
              label="pmk-r0-key-holder"
              definitionKey="interface.ssid.roaming.pmk-r0-key-holder"
              isDisabled
            />
            <DisplayStringField
              value={data?.roaming?.['pmk-r1-key-holder']}
              label="pmk-r1-key-holder"
              definitionKey="interface.ssid.roaming.pmk-r1-key-holder"
              isDisabled
            />
          </SimpleGrid>
        </>
      )}
    </>
  );
};

LockedAdvanced.propTypes = propTypes;
export default React.memo(LockedAdvanced);
