import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationStringField,
  ConfigurationElement,
} from 'ucentral-libs';

const LLdp = ({ fields, updateField, updateWithId, disabled }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="lldp"
              label="lldp"
              field={fields.lldp}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={disabled}
            />
          }
          enabled={fields.lldp.enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationStringField
                id="lldp.describe"
                label="describe"
                field={fields.lldp.describe}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={disabled}
              />
              <ConfigurationStringField
                id="lldp.location"
                label="location"
                field={fields.lldp.location}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={disabled}
              />
            </CCol>
          </CRow>
        </ConfigurationElement>
      </CCol>
    </CRow>
  </div>
);

LLdp.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default LLdp;
