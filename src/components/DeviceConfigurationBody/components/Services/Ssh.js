import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationToggle,
  ConfigurationIntField,
  ConfigurationMultiWithInput,
  ConfigurationElement,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const Ssh = ({ fields, updateField, updateWithId }) => {
  const { t } = useTranslation();
  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <ConfigurationSectionToggler
                id="ssh"
                label="ssh"
                field={fields.ssh}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            }
            enabled={fields.ssh.enabled}
          >
            <CRow>
              <CCol>
                <ConfigurationIntField
                  id="ssh.port"
                  label="port"
                  field={fields.ssh.port}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
                <ConfigurationMultiWithInput
                  t={t}
                  id="ssh.authorized-keys"
                  label="authorized-keys"
                  field={fields.ssh['authorized-keys']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled={false}
                />
                <ConfigurationToggle
                  id="ssh.password-authentication"
                  label="password-authentication"
                  field={fields.ssh['password-authentication']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled={false}
                />
              </CCol>
            </CRow>
          </ConfigurationElement>
        </CCol>
      </CRow>
    </div>
  );
};

Ssh.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Ssh;
