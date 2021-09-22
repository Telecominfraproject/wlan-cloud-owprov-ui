import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import Statistics from './Statistics';

const Metrics = ({ fields, updateWithId, updateField }) => (
  <div>
    <CRow>
      <CCol sm="6">
        <h5>Unit Section</h5>
      </CCol>
      <CCol sm="6" />
    </CRow>
    <Statistics fields={fields} updateWithId={updateWithId} updateField={updateField} />
  </div>
);

Metrics.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Metrics;
