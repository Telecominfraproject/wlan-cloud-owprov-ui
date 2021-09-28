import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationStringField,
  ConfigurationToggle,
  ConfigurationElement,
} from 'ucentral-libs';

const Ieee8021x = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="ieee8021x"
              label="ieee8021x"
              field={fields.ieee8021x}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          }
          enabled={fields.ieee8021x.enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationStringField
                id="ieee8021x.ca-certificate"
                label="ca-certificate"
                field={fields.ieee8021x['ca-certificate']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationToggle
                id="ieee8021x.use-local-certificate"
                label="use-local-certificate"
                field={fields.ieee8021x['use-local-certificate']}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
              <ConfigurationStringField
                id="ieee8021x.server-certificate"
                label="server-certificate"
                field={fields.ieee8021x['server-certificate']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationStringField
                id="ieee8021x.private-key"
                label="private-key"
                field={fields.ieee8021x['private-key']}
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

Ieee8021x.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Ieee8021x;
