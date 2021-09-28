import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationIntField,
  ConfigurationElement,
} from 'ucentral-libs';

const QualityOfService = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol>
        <ConfigurationElement
          header={
            <ConfigurationSectionToggler
              id="quality-of-service"
              label="quality-of-service"
              field={fields['quality-of-service']}
              updateField={updateField}
              firstCol="3"
              secondCol="9"
              disabled={false}
            />
          }
          enabled={fields['quality-of-service'].enabled}
        >
          <CRow>
            <CCol>
              <ConfigurationIntField
                id="quality-of-service.upload-rate"
                label="upload-rate"
                field={fields['quality-of-service']['upload-rate']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
              <ConfigurationIntField
                id="quality-of-service.download-rate"
                label="download-rate"
                field={fields['quality-of-service']['download-rate']}
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

QualityOfService.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default QualityOfService;
