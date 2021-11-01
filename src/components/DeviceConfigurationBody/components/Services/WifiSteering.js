import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationSelect,
  ConfigurationIntField,
  ConfigurationToggle,
  ConfigurationElement,
} from 'ucentral-libs';

const WifiSteering = ({ fields, updateField, updateWithId, disabled }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="wifi-steering"
              label="wifi-steering"
              field={fields['wifi-steering']}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={disabled}
            />
          }
          enabled={fields['wifi-steering'].enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationSelect
                id="wifi-steering.mode"
                label="mode"
                field={fields['wifi-steering'].mode}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                width="100px"
                disabled={disabled}
              />
              <ConfigurationToggle
                id="wifi-steering.assoc-steering"
                label="assoc-steering"
                field={fields['wifi-steering']['assoc-steering']}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={disabled}
              />
              <ConfigurationIntField
                id="wifi-steering.required-snr"
                label="required-snr"
                field={fields['wifi-steering']['required-snr']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={disabled}
              />
              <ConfigurationIntField
                id="wifi-steering.required-probe-snr"
                label="required-probe-snr"
                field={fields['wifi-steering']['required-probe-snr']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={disabled}
              />
              <ConfigurationIntField
                id="wifi-steering.required-roam-snr"
                label="required-roam-snr"
                field={fields['wifi-steering']['required-roam-snr']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={disabled}
              />
              <ConfigurationIntField
                id="wifi-steering.load-kick-threshold"
                label="load-kick-threshold"
                field={fields['wifi-steering']['load-kick-threshold']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={disabled}
              />
              <ConfigurationToggle
                id="wifi-steering.auto-channel"
                label="auto-channel"
                field={fields['wifi-steering']['auto-channel']}
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

WifiSteering.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default WifiSteering;
