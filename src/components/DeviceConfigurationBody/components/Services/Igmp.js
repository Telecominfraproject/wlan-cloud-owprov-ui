import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationToggle,
  ConfigurationElement,
} from 'ucentral-libs';

const Igmp = ({ fields, updateField, disabled }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="igmp"
              label="igmp"
              field={fields.igmp}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={disabled}
            />
          }
          enabled={fields.igmp.enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationToggle
                id="igmp.enable"
                label="enable"
                field={fields.igmp.enable}
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

Igmp.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Igmp;
