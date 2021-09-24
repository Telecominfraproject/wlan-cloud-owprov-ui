import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import { ConfigurationStringField, ConfigurationToggle } from 'ucentral-libs';

const Unit = ({ fields, updateWithId, updateField }) => (
  <div>
    <h5>Unit Section</h5>
    <CRow>
      <CCol md="6" xxl="4">
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
      <CCol md="6" xxl="4">
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
      <CCol md="6" xxl="4">
        <ConfigurationStringField
          id="timezone"
          label="timezone"
          field={fields.timezone}
          updateField={updateWithId}
          firstCol="3"
          secondCol="9"
          errorMessage="Error!!!!"
          disabled={false}
        />
      </CCol>
      <CCol md="6" xxl="4">
        <ConfigurationToggle
          id="leds-active"
          label="leds-active"
          field={fields['leds-active']}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      <CCol md="6" xxl="4">
        <ConfigurationToggle
          id="random-password"
          label="random-password"
          field={fields['random-password']}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      <CCol />
    </CRow>
  </div>
);

Unit.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Unit;
