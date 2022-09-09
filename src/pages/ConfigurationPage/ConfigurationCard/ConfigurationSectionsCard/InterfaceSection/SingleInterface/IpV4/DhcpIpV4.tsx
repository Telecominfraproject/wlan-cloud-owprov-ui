import React, { useMemo } from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import ConfigurationSubSectionToggle from 'components/CustomFields/ConfigurationSubSection';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';
import DhcpLeaseIpV4 from './DhcpLeaseIpV4';
import { INTERFACE_IPV4_DHCP_SCHEMA } from '../../interfacesConstants';

type Props = {
  isDisabled?: boolean;
  namePrefix: string;
};

const DhcpIpV4 = ({ namePrefix, isDisabled }: Props) => {
  const { t } = useTranslation();
  const [{ value }] = useField(`${namePrefix}.dhcp`);

  const isEnabled = useMemo(() => value !== undefined, [value]);

  const defaultValue = useMemo(() => INTERFACE_IPV4_DHCP_SCHEMA(t, true).cast(), []);
  const fieldsToDestroy = useMemo(() => [`${namePrefix}.dhcp-lease`], []);

  return (
    <>
      <ConfigurationSubSectionToggle
        name={`${namePrefix}.dhcp`}
        label="Enabled DHCP"
        fieldsToDestroy={fieldsToDestroy}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
      />
      {isEnabled && (
        <>
          <NumberField
            name={`${namePrefix}.dhcp.lease-first`}
            label="dhcp.lease-first"
            definitionKey="interface.ipv4.dhcp.lease-first"
            isDisabled={isDisabled}
            isRequired
          />
          <NumberField
            name={`${namePrefix}.dhcp.lease-count`}
            label="dhcp.lease-count"
            definitionKey="interface.ipv4.dhcp.lease-count"
            isDisabled={isDisabled}
            isRequired
          />
          <StringField
            name={`${namePrefix}.dhcp.lease-time`}
            label="dhcp.lease-time"
            definitionKey="interface.ipv4.dhcp.lease-time"
            isDisabled={isDisabled}
            isRequired
          />
          <StringField
            name={`${namePrefix}.dhcp.relay-server`}
            label="dhcp.relay-server"
            definitionKey="interface.ipv4.dhcp.relay-server"
            isDisabled={isDisabled}
            emptyIsUndefined
          />
          <DhcpLeaseIpV4 namePrefix={namePrefix} isDisabled={isDisabled} />
        </>
      )}
    </>
  );
};

export default React.memo(DhcpIpV4);
