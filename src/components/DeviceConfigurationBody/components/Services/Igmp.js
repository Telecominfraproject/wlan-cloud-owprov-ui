import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationToggle } from 'ucentral-libs';

const Igmp = ({ fields, updateField }) => (
  <div>
    <CRow>
      <CCol md="6" xxl="4">
        <ConfigurationSectionToggler
          id="igmp"
          label="igmp"
          field={fields.igmp}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      {!fields.igmp.enabled ? null : (
        <CCol md="6" xxl="4" hidden={!fields.igmp.enabled}>
          <ConfigurationToggle
            id="igmp.enable"
            label="enable"
            field={fields.igmp.enable}
            updateField={updateField}
            firstCol="3"
            secondCol="9"
            disabled={false}
          />
        </CCol>
      )}
    </CRow>
  </div>
);

Igmp.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Igmp;
