import React from 'react';
import { CRow, CCol } from '@coreui/react';
import PropTypes from 'prop-types';
import Statistics from './Statistics';
import Health from './Health';
import WifiFrames from './WifiFrames';
import DhcpSnooping from './DhcpSnooping';

const Metrics = ({ fields, updateWithId, updateField }) => (
  <div>
    <h5>Unit Section</h5>
    <CRow>
      <CCol xl="6" xxl="4">
        <Statistics fields={fields} updateWithId={updateWithId} updateField={updateField} />
        <DhcpSnooping fields={fields} updateField={updateField} />
      </CCol>
      <CCol xl="6" xxl="4">
        <Health fields={fields} updateWithId={updateWithId} updateField={updateField} />
      </CCol>
      <CCol xl="6" xxl="4">
        <WifiFrames fields={fields} updateField={updateField} />
      </CCol>
    </CRow>
  </div>
);

Metrics.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Metrics;
