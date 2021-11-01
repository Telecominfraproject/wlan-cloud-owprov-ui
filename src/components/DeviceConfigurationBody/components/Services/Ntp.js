import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationToggle,
  ConfigurationMultiWithInput,
  ConfigurationElement,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const Ntp = ({ fields, updateField, disabled }) => {
  const { t } = useTranslation();
  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <ConfigurationSectionToggler
                id="ntp"
                label="ntp"
                field={fields.ntp}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={disabled}
              />
            }
            enabled={fields.ntp.enabled}
          >
            <CRow>
              <CCol>
                <ConfigurationMultiWithInput
                  t={t}
                  id="ntp.servers"
                  label="servers"
                  field={fields.ntp.servers}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled={disabled}
                />
                <ConfigurationToggle
                  id="ntp.local-server"
                  label="local-server"
                  field={fields.ntp['local-server']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled={disabled}
                />
              </CCol>
            </CRow>
          </ConfigurationElement>
        </CCol>
      </CRow>
    </div>
  );
};

Ntp.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Ntp;
