import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationElement,
  ConfigurationSectionToggler,
  ConfigurationMulti,
} from 'ucentral-libs';

const WifiFrames = ({ fields, updateField, disabled }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="wifi-frames"
              label="wifi-frames"
              field={fields['wifi-frames']}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={disabled}
            />
          }
          enabled={fields['wifi-frames'].enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationMulti
                id="wifi-frames.filters"
                label="filters"
                field={fields['wifi-frames'].filters}
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

WifiFrames.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default WifiFrames;
