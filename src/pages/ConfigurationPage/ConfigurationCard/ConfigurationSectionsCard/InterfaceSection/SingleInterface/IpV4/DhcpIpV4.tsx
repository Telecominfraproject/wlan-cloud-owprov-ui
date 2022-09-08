import React, { useMemo } from 'react';
import StringField from 'components/FormFields/StringField';
import { useField } from 'formik';
import NumberField from 'components/FormFields/NumberField';
import ConfigurationSubSectionToggle from 'components/CustomFields/ConfigurationSubSection';
import { useTranslation } from 'react-i18next';
import DhcpLeaseIpV4 from './DhcpLeaseIpV4';
import { INTERFACE_IPV4_DHCP_SCHEMA } from '../../interfacesConstants';

const DhcpIpV4: React.FC<{ editing: boolean; index: number }> = ({ editing, index }) => {
  const { t } = useTranslation();
  const [{ value }] = useField(`configuration[${index}].ipv4.dhcp`);

  const isEnabled = useMemo(() => value !== undefined, [value]);

  const defaultValue = useMemo(() => INTERFACE_IPV4_DHCP_SCHEMA(t, true).cast(), []);
  const fieldsToDestroy = useMemo(() => [`configuration[${index}].ipv4.dhcp-lease`], []);

  return (
    <>
      <ConfigurationSubSectionToggle
        name={`configuration[${index}].ipv4.dhcp`}
        label="Enabled DHCP"
        fieldsToDestroy={fieldsToDestroy}
        defaultValue={defaultValue}
        isDisabled={!editing}
      />
      {isEnabled && (
        <>
          <NumberField
            name={`configuration[${index}].ipv4.dhcp.lease-first`}
            label="dhcp.lease-first"
            definitionKey="interface.ipv4.dhcp.lease-first"
            isDisabled={!editing}
            isRequired
          />
          <NumberField
            name={`configuration[${index}].ipv4.dhcp.lease-count`}
            label="dhcp.lease-count"
            definitionKey="interface.ipv4.dhcp.lease-count"
            isDisabled={!editing}
            isRequired
          />
          <StringField
            name={`configuration[${index}].ipv4.dhcp.lease-time`}
            label="dhcp.lease-time"
            definitionKey="interface.ipv4.dhcp.lease-time"
            isDisabled={!editing}
            isRequired
          />
          <StringField
            name={`configuration[${index}].ipv4.dhcp.relay-server`}
            label="dhcp.relay-server"
            definitionKey="interface.ipv4.dhcp.relay-server"
            isDisabled={!editing}
            emptyIsUndefined
          />
          <DhcpLeaseIpV4 editing={editing} index={index} />
        </>
      )}
    </>
  );
};

export default React.memo(DhcpIpV4);
