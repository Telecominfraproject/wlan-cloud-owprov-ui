import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import ToggleField from 'components/FormFields/ToggleField';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';
import ConfigurationSubSectionToggle from 'components/CustomFields/ConfigurationSubSection';
import { INTERFACE_IPV4_DHCP_LEASE_SCHEMA } from '../../interfacesConstants';

const DhcpLeaseIpV4: React.FC<{ editing: boolean; index: number }> = ({ editing, index }) => {
  const { t } = useTranslation();
  const [{ value }] = useField(`configuration[${index}].ipv4.dhcp-lease`);

  const isEnabled = useMemo(() => value !== undefined, [value]);

  const defaultValue = useMemo(() => INTERFACE_IPV4_DHCP_LEASE_SCHEMA(t, true).cast(), []);

  return (
    <>
      <ConfigurationSubSectionToggle
        name={`configuration[${index}].ipv4.dhcp-lease`}
        label="Enable DHCP-LEASE"
        defaultValue={defaultValue}
        isDisabled={!editing}
      />
      {isEnabled && (
        <>
          <StringField
            name={`configuration[${index}].ipv4.dhcp-lease.macaddr`}
            label="dhcp-lease.macaddr"
            definitionKey="interface.ipv4.dhcp-lease.macaddr"
            isDisabled={!editing}
            isRequired
          />
          <StringField
            name={`configuration[${index}].ipv4.dhcp-lease.lease-time`}
            label="dhcp-lease.lease-time"
            definitionKey="interface.ipv4.dhcp-lease.lease-time"
            isDisabled={!editing}
            isRequired
          />
          <NumberField
            name={`configuration[${index}].ipv4.dhcp-lease.static-lease-offset`}
            label="dhcp-lease.static-lease-offset"
            definitionKey="interface.ipv4.dhcp-lease.static-lease-offset"
            isDisabled={!editing}
            isRequired
          />
          <ToggleField
            name={`configuration[${index}].ipv4.dhcp-lease.publish-hostname`}
            label="dhcp-lease.publish-hostname"
            definitionKey="interface.ipv4.dhcp-lease.publish-hostname"
            isDisabled={!editing}
          />
        </>
      )}
    </>
  );
};

export default React.memo(DhcpLeaseIpV4);
