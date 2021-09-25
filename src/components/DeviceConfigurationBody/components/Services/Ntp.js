import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CCollapse } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationToggle,
  ConfigurationMultiWithInput,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const Ntp = ({ fields, updateField }) => {
  const { t } = useTranslation();
  return (
    <div>
      <CRow>
        <CCol md="6" xxl="4">
          <ConfigurationSectionToggler
            id="ntp"
            label="ntp"
            field={fields.ntp}
            updateField={updateField}
            firstCol="3"
            secondCol="9"
            disabled={false}
          />
        </CCol>
        <CCol />
      </CRow>
      <CCollapse show={fields.ntp.enabled}>
        {!fields.ntp.enabled ? null : (
          <CRow>
            <CCol md="6" xxl="4">
              <ConfigurationMultiWithInput
                t={t}
                id="ntp.servers"
                label="servers"
                field={fields.ntp.servers}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            </CCol>
            <CCol md="6" xxl="4">
              <ConfigurationToggle
                id="ntp.local-server"
                label="local-server"
                field={fields.ntp['local-server']}
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

Ntp.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Ntp;
