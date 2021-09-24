import React from 'react';
import PropTypes from 'prop-types';
import LLdp from './Lldp';

const Services = ({ fields, updateWithId, updateField }) => (
  <div>
    <h5>Services Section</h5>
    <LLdp fields={fields} updateWithId={updateWithId} updateField={updateField} />
  </div>
);

Services.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Services;
