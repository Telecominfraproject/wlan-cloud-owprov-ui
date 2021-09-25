import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationStringField,
  ConfigurationIntField,
} from 'ucentral-libs';

const Rtty = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol md="6" xxl="4">
        <ConfigurationSectionToggler
          id="rtty"
          label="rtty"
          field={fields.rtty}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      <CCol />
    </CRow>
    <CCollapse show={fields.rtty.enabled}>
      {!fields.rtty.enabled ? null : (
        <CRow>
          <CCol md="6" xxl="4">
            <ConfigurationStringField
              id="rtty.host"
              label="host"
              field={fields.rtty.host}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationIntField
              id="rtty.port"
              label="port"
              field={fields.rtty.port}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationStringField
              id="rtty.token"
              label="token"
              field={fields.rtty.token}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
        </CRow>
      )}
    </CCollapse>
  </div>
);

Rtty.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Rtty;
