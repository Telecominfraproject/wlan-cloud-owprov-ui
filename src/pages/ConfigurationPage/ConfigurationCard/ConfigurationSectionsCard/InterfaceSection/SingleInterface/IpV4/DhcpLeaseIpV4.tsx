import React, { useMemo } from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import ConfigurationSubSectionToggle from 'components/CustomFields/ConfigurationSubSection';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import { INTERFACE_IPV4_DHCP_LEASE_SCHEMA } from '../../interfacesConstants';

type Props = {
  isDisabled?: boolean;
  namePrefix: string;
};

const DhcpLeaseIpV4 = ({ namePrefix, isDisabled }: Props) => {
  const { t } = useTranslation();
  const [{ value }] = useField(`${namePrefix}.dhcp-lease`);

  const isEnabled = useMemo(() => value !== undefined, [value]);

  const defaultValue = useMemo(() => INTERFACE_IPV4_DHCP_LEASE_SCHEMA(t, true).cast(), []);

  return (
    <>
      <ConfigurationSubSectionToggle
        name={`${namePrefix}.dhcp-lease`}
        label="Enable DHCP-LEASE"
        defaultValue={defaultValue}
        isDisabled={isDisabled}
      />
      {isEnabled && (
        <>
          <StringField
            name={`${namePrefix}.dhcp-lease.macaddr`}
            label="dhcp-lease.macaddr"
            definitionKey="interface.ipv4.dhcp-lease.macaddr"
            isDisabled={isDisabled}
            isRequired
          />
          <StringField
            name={`${namePrefix}.dhcp-lease.lease-time`}
            label="dhcp-lease.lease-time"
            definitionKey="interface.ipv4.dhcp-lease.lease-time"
            isDisabled={isDisabled}
            isRequired
          />
          <NumberField
            name={`${namePrefix}.dhcp-lease.static-lease-offset`}
            label="dhcp-lease.static-lease-offset"
            definitionKey="interface.ipv4.dhcp-lease.static-lease-offset"
            isDisabled={isDisabled}
            isRequired
          />
          <ToggleField
            name={`${namePrefix}.dhcp-lease.publish-hostname`}
            label="dhcp-lease.publish-hostname"
            definitionKey="interface.ipv4.dhcp-lease.publish-hostname"
            isDisabled={isDisabled}
          />
        </>
      )}
    </>
  );
};

export default React.memo(DhcpLeaseIpV4);
