import React from 'react';
import PropTypes from 'prop-types';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import DhcpIpV4 from './DhcpIpV4';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  isEnabled: PropTypes.bool.isRequired,
};

const IpV4 = ({ editing, index, isEnabled }) => {
  if (!isEnabled) return null;

  return (
    <>
      <StringField
        name={`configuration[${index}].ipv4.subnet`}
        label="subnet"
        definitionKey="interface.ipv4.subnet"
        isDisabled={!editing}
      />
      <StringField
        name={`configuration[${index}].ipv4.gateway`}
        label="gateway"
        definitionKey="interface.ipv4.gateway"
        isDisabled={!editing}
      />
      <ToggleField
        name={`configuration[${index}].ipv4.send-hostname`}
        label="send-hostname"
        definitionKey="interface.ipv4.send-hostname"
        isDisabled={!editing}
        isRequired
      />
      <CreatableSelectField
        name={`configuration[${index}].ipv4.use-dns`}
        label="use-dns"
        definitionKey="interface.ipv4.use-dns"
        isDisabled={!editing}
      />
      <DhcpIpV4 index={index} editing={editing} />
    </>
  );
};
IpV4.propTypes = propTypes;
export default React.memo(IpV4);
