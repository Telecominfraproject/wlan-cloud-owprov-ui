import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationStringField,
  ConfigurationIntField,
  ConfigurationElement,
} from 'ucentral-libs';

const Rtty = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="rtty"
              label="rtty"
              field={fields.rtty}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          }
          enabled={fields.rtty.enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationStringField
                id="rtty.host"
                label="host"
                field={fields.rtty.host}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationIntField
                id="rtty.port"
                label="port"
                field={fields.rtty.port}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationStringField
                id="rtty.token"
                label="token"
                field={fields.rtty.token}
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

Rtty.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Rtty;
