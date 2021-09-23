import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationMulti } from 'ucentral-libs';

const WifiFrames = ({ fields, updateField }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationSectionToggler
          id="wifi-frames"
          label="wifi-frames"
          field={fields['wifi-frames']}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      <CCol />
    </CRow>
    <CCollapse show={fields['wifi-frames'].enabled}>
      <CRow>
        <CCol>
          <ConfigurationMulti
            id="wifi-frames.filters"
            label="filters"
            field={fields['wifi-frames'].filters}
            updateField={updateField}
            firstCol="3"
            secondCol="9"
            disabled={false}
          />
        </CCol>
        <CCol />
      </CRow>
    </CCollapse>
  </div>
);

WifiFrames.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
};

export default WifiFrames;