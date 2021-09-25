import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationToggle } from 'ucentral-libs';

const Mdns = ({ fields, updateField }) => (
  <div>
    <CRow>
      <CCol md="6" xxl="4">
        <ConfigurationSectionToggler
          id="mdns"
          label="mdns"
          field={fields.mdns}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      {!fields.mdns.enabled ? null : (
        <CCol md="6" xxl="4" hidden={!fields.mdns.enabled}>
          <ConfigurationToggle
            id="mdns.enable"
            label="enable"
            field={fields.mdns.enable}
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

Mdns.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Mdns;
