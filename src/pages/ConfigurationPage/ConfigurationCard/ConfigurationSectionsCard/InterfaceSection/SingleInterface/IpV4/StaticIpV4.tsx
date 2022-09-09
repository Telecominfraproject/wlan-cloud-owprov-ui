import React from 'react';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import DhcpIpV4 from './DhcpIpV4';

type Props = {
  isDisabled?: boolean;
  namePrefix: string;
  isEnabled: boolean;
};

const IpV4 = ({ isDisabled, namePrefix, isEnabled }: Props) => {
  if (!isEnabled) return null;

  return (
    <>
      <StringField
        name={`${namePrefix}.subnet`}
        label="subnet"
        definitionKey="interface.ipv4.subnet"
        isDisabled={isDisabled}
      />
      <StringField
        name={`${namePrefix}.gateway`}
        label="gateway"
        definitionKey="interface.ipv4.gateway"
        isDisabled={isDisabled}
      />
      <ToggleField
        name={`${namePrefix}.send-hostname`}
        label="send-hostname"
        definitionKey="interface.ipv4.send-hostname"
        isDisabled={isDisabled}
        isRequired
      />
      <CreatableSelectField
        name={`${namePrefix}.use-dns`}
        label="use-dns"
        definitionKey="interface.ipv4.use-dns"
        isDisabled={isDisabled}
      />
      <DhcpIpV4 namePrefix={namePrefix} isDisabled={isDisabled} />
    </>
  );
};

export default React.memo(IpV4);
