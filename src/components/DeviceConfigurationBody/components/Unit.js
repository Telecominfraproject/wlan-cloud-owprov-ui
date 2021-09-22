import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationStringField } from 'ucentral-libs';

const Unit = ({ isActive, setActive, fields, updateWithId }) => {
  const toggleActive = () => setActive(!isActive);
  return (
    <div>
      <CRow>
        <CCol sm="6">
          <ConfigurationSectionToggler
            label="Unit Section"
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
              id="name"
              label="name"
              field={fields.name}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol>
            <ConfigurationStringField
              id="location"
              label="location"
              field={fields.location}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <ConfigurationStringField
              id="timezone"
              label="timezon"
              field={fields.timezone}
              updateField={updateWithId}
              firstCol="3"
              secondCol="9"
              errorMessage="Error!!!!"
              disabled={false}
            />
          </CCol>
          <CCol />
        </CRow>
      </CCollapse>
    </div>
  );
};

Unit.propTypes = {
  isActive: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Unit;
