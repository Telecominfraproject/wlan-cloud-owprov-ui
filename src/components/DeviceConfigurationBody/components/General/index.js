import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CFormGroup } from '@coreui/react';
import {
  ConfigurationStringField,
  ConfigurationIntField,
  ConfigurationElement,
} from 'ucentral-libs';

const General = ({ fields, updateWithId }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <CFormGroup row className="py-1 pb-0 mb-0">
              <h6 className="mt-1 pr-5">General Information</h6>
            </CFormGroup>
          }
          enabled
        >
          <CRow>
            <CCol>
              <ConfigurationStringField
                id="name"
                label="name"
                field={fields.name}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Required"
                disabled={false}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <ConfigurationStringField
                id="description"
                label="description"
                field={fields.description}
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
              <ConfigurationIntField
                id="weight"
                label="weight"
                field={fields.weight}
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

General.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default General;
