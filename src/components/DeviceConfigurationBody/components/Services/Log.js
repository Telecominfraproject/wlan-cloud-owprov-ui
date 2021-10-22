import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationSelect,
  ConfigurationStringField,
  ConfigurationIntField,
  ConfigurationElement,
} from 'ucentral-libs';

const Log = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="log"
              label="log"
              field={fields.log}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          }
          enabled={fields.log.enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationStringField
                id="log.host"
                label="host"
                field={fields.log.host}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationIntField
                id="log.port"
                label="port"
                field={fields.log.port}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationSelect
                id="log.proto"
                label="proto"
                field={fields.log.proto}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                width="100px"
                disabled={false}
              />
              <ConfigurationIntField
                id="log.size"
                label="size"
                field={fields.log.size}
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

Log.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Log;
