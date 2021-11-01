import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationIntField,
  ConfigurationElement,
} from 'ucentral-libs';

const Http = ({ fields, updateField, updateWithId, disabled }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="http"
              label="http"
              field={fields.http}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={disabled}
            />
          }
          enabled={fields.http.enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationIntField
                id="http.http-port"
                label="port"
                field={fields.http['http-port']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={disabled}
              />
            </CCol>
          </CRow>
        </ConfigurationElement>
      </CCol>
    </CRow>
  </div>
);

Http.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Http;
