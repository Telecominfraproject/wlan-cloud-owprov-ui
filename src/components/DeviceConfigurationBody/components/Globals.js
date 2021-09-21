import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationStringField } from 'ucentral-libs';

const Globals = ({ isActive, setActive, fields, updateWithId }) => {
  const toggleActive = () => setActive(!isActive);

  return (
    <div>
      <CRow>
        <CCol sm="6">
          <ConfigurationSectionToggler
            label="Globals Section"
            active={isActive}
            toggle={toggleActive}
          />
        </CCol>
        <CCol sm="6" />
      </CRow>
      <CCollapse show={isActive}>
        <CRow>
          <CCol>
            <ConfigurationStringField
              id="ipv4-network"
              label="ipv4-network"
              field={fields['ipv4-network']}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol>
            <ConfigurationStringField
              id="ipv6-network"
              label="ipv6-network"
              field={fields['ipv6-network']}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
        </CRow>
      </CCollapse>
    </div>
  );
};

Globals.propTypes = {
  isActive: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Globals;
