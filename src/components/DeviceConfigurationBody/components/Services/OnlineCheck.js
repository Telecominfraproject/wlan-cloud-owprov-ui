import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationMulti,
  ConfigurationIntField,
  ConfigurationMultiWithInput,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const OnlineCheck = ({ fields, updateField, updateWithId }) => {
  const { t } = useTranslation();
  return (
    <div>
      <CRow>
        <CCol md="6" xxl="4">
          <ConfigurationSectionToggler
            id="online-check"
            label="online-check"
            field={fields['online-check']}
            updateField={updateField}
            firstCol="3"
            secondCol="9"
            disabled={false}
          />
        </CCol>
        <CCol />
      </CRow>
      <CCollapse show={fields['online-check'].enabled}>
        {!fields['online-check'].enabled ? null : (
          <CRow>
            <CCol md="6" xxl="4">
              <ConfigurationMultiWithInput
                t={t}
                id="online-check.ping-hosts"
                label="ping-hosts"
                field={fields['online-check']['ping-hosts']}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            </CCol>
            <CCol md="6" xxl="4">
              <ConfigurationMultiWithInput
                t={t}
                id="online-check.download-hosts"
                label="download-hosts"
                field={fields['online-check']['download-hosts']}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            </CCol>
            <CCol md="6" xxl="4">
              <ConfigurationIntField
                id="online-check.check-interval"
                label="check-interval"
                field={fields['online-check']['check-interval']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
            </CCol>
            <CCol md="6" xxl="4">
              <ConfigurationIntField
                id="online-check.check-threshold"
                label="check-threshold"
                field={fields['online-check']['check-threshold']}
                updateField={updateWithId}
                firstCol="3"
                secondCol="9"
                errorMessage="Error!!!!"
                disabled={false}
              />
            </CCol>
            <CCol md="6" xxl="4">
              <ConfigurationMulti
                id="online-check.action"
                label="action"
                field={fields['online-check'].action}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            </CCol>
          </CRow>
        )}
      </CCollapse>
    </div>
  );
};

OnlineCheck.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default OnlineCheck;
