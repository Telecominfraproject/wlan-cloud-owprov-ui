import React from 'react';
import PropTypes from 'prop-types';
import StringField from 'components/FormFields/StringField';
import NumberField from 'components/FormFields/NumberField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

const TunnelValues = ({ editing, index, type }) => {
  if (type === '' || type === 'mesh') return null;

  if (type === 'vxlan')
    return (
      <>
        <StringField
          key="vxlan.peer-address"
          name={`configuration[${index}].tunnel.peer-address`}
          label="peer-address"
          definitionKey="interface.tunnel.vxlan.peer-address"
          isDisabled={!editing}
          isRequired
        />
        <NumberField
          key="vxlan.peer-port"
          name={`configuration[${index}].tunnel.peer-port`}
          label="peer-port"
          definitionKey="interface.tunnel.vxlan.peer-port"
          isDisabled={!editing}
          isRequired
        />
      </>
    );

  if (type === 'l2tp') {
    return (
      <>
        <StringField
          key="l2tp.server"
          name={`configuration[${index}].tunnel.server`}
          label="server"
          definitionKey="interface.tunnel.l2tp.server"
          isDisabled={!editing}
          isRequired
        />
        <StringField
          key="l2tp.user-name"
          name={`configuration[${index}].tunnel.user-name`}
          label="user-name"
          definitionKey="interface.tunnel.l2tp.user-name"
          isDisabled={!editing}
          isRequired
        />
        <StringField
          key="l2tp.password"
          name={`configuration[${index}].tunnel.password`}
          definitionKey="interface.tunnel.l2tp.password"
          label="password"
          isDisabled={!editing}
          isRequired
          hideButton
        />
      </>
    );
  }

  return (
    <StringField
      key="gre.peer-address"
      name={`configuration[${index}].tunnel.peer-address`}
      label="peer-address"
      definitionKey="interface.tunnel.gre.peer-address"
      isDisabled={!editing}
      isRequired
    />
  );
};
TunnelValues.propTypes = propTypes;
export default React.memo(TunnelValues);
