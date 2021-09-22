import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import { ConfigurationStringField } from 'ucentral-libs';

const Globals = ({ fields, updateWithId }) => (
  <div>
    <CRow>
      <CCol sm="6">
        <h5>Globals Section</h5>
      </CCol>
      <CCol sm="6" />
    </CRow>
    <CRow>
      <CCol>
        <ConfigurationStringField
          id="ipv4-network"
          label="ipv4-network"
          field={fields['ipv4-network']}
          updateField={updateWithId}
          firstCol="3"
          secondCol="9"
          errorMessage="Error!!!!"
          disabled={false}
        />
      </CCol>
      <CCol>
        <ConfigurationStringField
          id="ipv6-network"
          label="ipv6-network"
          field={fields['ipv6-network']}
          updateField={updateWithId}
          firstCol="3"
          secondCol="9"
          errorMessage="Error!!!!"
          disabled={false}
        />
      </CCol>
    </CRow>
  </div>
);

Globals.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Globals;
