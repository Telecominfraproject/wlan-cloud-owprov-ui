import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationIntField } from 'ucentral-libs';

const Health = ({ fields, updateWithId, updateField }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationSectionToggler
          id="health"
          label="health"
          field={fields.health}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      <CCol />
    </CRow>
    <CCollapse show={fields.health.enabled}>
      <CRow>
        <CCol>
          <ConfigurationIntField
            id="health.interval"
            label="interval"
            field={fields.health.interval}
            updateField={updateWithId}
            firstCol="3"
            secondCol="9"
            errorMessage="Error!!!!"
            disabled={false}
          />
        </CCol>
        <CCol />
      </CRow>
    </CCollapse>
  </div>
);

Health.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Health;
