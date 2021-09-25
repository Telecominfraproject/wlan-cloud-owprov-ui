import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import { ConfigurationSectionToggler, ConfigurationIntField } from 'ucentral-libs';

const QualityOfService = ({ fields, updateField, updateWithId }) => (
  <div>
    <CRow>
      <CCol md="6" xxl="4">
        <ConfigurationSectionToggler
          id="quality-of-service"
          label="quality-of-service"
          field={fields['quality-of-service']}
          updateField={updateField}
          firstCol="3"
          secondCol="9"
          disabled={false}
        />
      </CCol>
      <CCol />
    </CRow>
    <CCollapse show={fields['quality-of-service'].enabled}>
      {!fields['quality-of-service'].enabled ? null : (
        <CRow>
          <CCol md="6" xxl="4">
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
          </CCol>
          <CCol md="6" xxl="4">
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
      )}
    </CCollapse>
  </div>
);

QualityOfService.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default QualityOfService;
