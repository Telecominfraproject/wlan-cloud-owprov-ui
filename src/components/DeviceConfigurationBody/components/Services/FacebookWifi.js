import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationStringField,
  ConfigurationElement,
} from 'ucentral-libs';

const FacebookWifi = ({ fields, updateField, updateWithId, disabled }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="facebook-wifi"
              label="facebook-wifi"
              field={fields['facebook-wifi']}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={disabled}
            />
          }
          enabled={fields['facebook-wifi'].enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationStringField
                id="facebook-wifi.vendor-id"
                label="vendor-id"
                field={fields['facebook-wifi']['vendor-id']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={disabled}
              />
              <ConfigurationStringField
                id="facebook-wifi.gateway-id"
                label="gateway-id"
                field={fields['facebook-wifi']['gateway-id']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={disabled}
              />
              <ConfigurationStringField
                id="facebook-wifi.secret"
                label="secret"
                field={fields['facebook-wifi'].secret}
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

FacebookWifi.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default FacebookWifi;
