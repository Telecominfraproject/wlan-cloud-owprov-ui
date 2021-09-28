import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationIntField,
  ConfigurationElement,
} from 'ucentral-libs';

const Http = ({ fields, updateField, updateWithId }) => (
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
              disabled={false}
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
                disabled={false}
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
};

export default Http;
