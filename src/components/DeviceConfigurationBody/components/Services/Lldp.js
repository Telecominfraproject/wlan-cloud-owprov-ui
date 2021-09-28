import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationStringField,
  ConfigurationElement,
} from 'ucentral-libs';

const LLdp = ({ fields, updateField, updateWithId }) => (
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
              disabled={false}
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
                disabled={false}
              />
              <ConfigurationStringField
                id="lldp.location"
                label="location"
                field={fields.lldp.location}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
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
};

export default LLdp;
