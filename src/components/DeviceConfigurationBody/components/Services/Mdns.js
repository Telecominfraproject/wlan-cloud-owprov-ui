import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationToggle,
  ConfigurationElement,
} from 'ucentral-libs';

const Mdns = ({ fields, updateField, disabled }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="mdns"
              label="mdns"
              field={fields.mdns}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={disabled}
            />
          }
          enabled={fields.mdns.enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationToggle
                id="mdns.enable"
                label="enable"
                field={fields.mdns.enable}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={disabled}
              />
            </CCol>
          </CRow>
        </ConfigurationElement>
      </CCol>
    </CRow>
  </div>
);

Mdns.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Mdns;
