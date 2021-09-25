import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationMulti,
  ConfigurationIntField,
  ConfigurationToggle,
} from 'ucentral-libs';

const WifiSteering = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol md="6" xxl="4">
        <ConfigurationSectionToggler
          id="wifi-steering"
          label="wifi-steering"
          field={fields['wifi-steering']}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      <CCol />
    </CRow>
    <CCollapse show={fields['wifi-steering'].enabled}>
      {!fields['wifi-steering'].enabled ? null : (
        <CRow>
          <CCol md="6" xxl="4">
            <ConfigurationMulti
              id="wifi-steering.mode"
              label="mode"
              field={fields['wifi-steering'].mode}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationToggle
              id="wifi-steering.assoc-steering"
              label="assoc-steering"
              field={fields['wifi-steering']['assoc-steering']}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationIntField
              id="wifi-steering.required-snr"
              label="required-snr"
              field={fields['wifi-steering']['required-snr']}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationIntField
              id="wifi-steering.required-probe-snr"
              label="required-probe-snr"
              field={fields['wifi-steering']['required-probe-snr']}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationIntField
              id="wifi-steering.required-roam-snr"
              label="required-roam-snr"
              field={fields['wifi-steering']['required-roam-snr']}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationIntField
              id="wifi-steering.load-kick-threshold"
              label="load-kick-threshold"
              field={fields['wifi-steering']['load-kick-threshold']}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol md="6" xxl="4">
            <ConfigurationToggle
              id="wifi-steering.auto-channel"
              label="auto-channel"
              field={fields['wifi-steering']['auto-channel']}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          </CCol>
        </CRow>
      )}
    </CCollapse>
  </div>
);

WifiSteering.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default WifiSteering;
