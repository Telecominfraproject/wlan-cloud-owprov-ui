import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationStringField } from 'ucentral-libs';

const LLdp = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol md="6" xxl="4">
        <ConfigurationSectionToggler
          id="lldp"
          label="lldp"
          field={fields.lldp}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      <CCol />
    </CRow>
    <CCollapse show={fields.lldp.enabled}>
      <CRow>
        <CCol md="6" xxl="4">
          <ConfigurationStringField
            id="lldp.describe"
            label="describe"
            field={fields.lldp.describe}
            updateField={updateWithId}
            firstCol="3"
            secondCol="9"
            errorMessage="Error!!!!"
            disabled={false}
          />
        </CCol>
        <CCol md="6" xxl="4">
          <ConfigurationStringField
            id="lldp.location"
            label="location"
            field={fields.lldp.location}
            updateField={updateWithId}
            firstCol="3"
            secondCol="9"
            errorMessage="Error!!!!"
            disabled={false}
          />
        </CCol>
      </CRow>
    </CCollapse>
  </div>
);

LLdp.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default LLdp;
