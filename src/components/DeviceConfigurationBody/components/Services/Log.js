import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationMulti,
  ConfigurationStringField,
  ConfigurationIntField,
} from 'ucentral-libs';

const Log = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol md="6" xxl="4">
        <ConfigurationSectionToggler
          id="log"
          label="log"
          field={fields.log}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
    </CRow>
    <CCollapse show={fields.log.enabled}>
      {!fields.log.enabled ? null : (
        <CRow>
          <CCol md="6" xxl="4">
            <ConfigurationStringField
              id="log.host"
              label="host"
              field={fields.log.host}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationIntField
              id="log.port"
              label="port"
              field={fields.log.port}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationMulti
              id="log.proto"
              label="proto"
              field={fields.log.proto}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationIntField
              id="log.size"
              label="size"
              field={fields.log.size}
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

Log.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Log;
