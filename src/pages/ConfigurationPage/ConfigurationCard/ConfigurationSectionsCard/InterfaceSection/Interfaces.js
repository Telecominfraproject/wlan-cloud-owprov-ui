import React from 'react';
import PropTypes from 'prop-types';
import SingleInterface from './SingleInterface';
import CreateInterfaceButton from './CreateInterfaceButton';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired,
  interfacesLength: PropTypes.number.isRequired,
};

const Interfaces = ({ editing, arrayHelpers, interfacesLength }) => (
  <>
    {Array(interfacesLength)
      .fill(1)
      .map((el, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <SingleInterface key={i} index={i} remove={arrayHelpers.remove} editing={editing} />
      ))}
    <CreateInterfaceButton editing={editing} arrayHelpers={arrayHelpers} />
  </>
);

Interfaces.propTypes = propTypes;
export default React.memo(Interfaces);
