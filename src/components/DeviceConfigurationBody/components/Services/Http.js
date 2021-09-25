import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationIntField } from 'ucentral-libs';

const Http = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol md="6" xxl="4">
        <ConfigurationSectionToggler
          id="http"
          label="http"
          field={fields.http}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      {!fields.http.enabled ? null : (
        <CCol hidden={!fields.http.enabled} md="6" xxl="4">
          <ConfigurationIntField
            id="http.http-port"
            label="port"
            field={fields.http['http-port']}
            updateField={updateWithId}
            firstCol="3"
            secondCol="9"
            errorMessage="Error!!!!"
            disabled={false}
          />
        </CCol>
      )}
    </CRow>
  </div>
);

Http.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Http;
