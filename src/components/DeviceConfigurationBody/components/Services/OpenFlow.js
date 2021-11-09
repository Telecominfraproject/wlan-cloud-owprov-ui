import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationSelect,
  ConfigurationStringField,
  ConfigurationElement,
  ConfigurationFileField,
  FileToStringButton,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const OpenFlow = ({ fields, updateField, updateWithId, batchSetField, disabled }) => {
  const { t } = useTranslation();
  const saveCa = (value, fileName) => {
    batchSetField([
      { id: 'open-flow.ca-certificate', value },
      { id: 'open-flow.ca-certificate-filename', value: fileName ?? 'Unknown' },
    ]);
  };
  const saveKey = (value, fileName) => {
    batchSetField([
      { id: 'open-flow.private-key', value },
      { id: 'open-flow.private-key-filename', value: fileName ?? 'Unknown' },
    ]);
  };
  const saveSsl = (value, fileName) => {
    batchSetField([
      { id: 'open-flow.ssl-certificate', value },
      { id: 'open-flow.ssl-certificate-filename', value: fileName ?? 'Unknown' },
    ]);
  };

  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <ConfigurationSectionToggler
                id="open-flow"
                label="open-flow"
                field={fields['open-flow']}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={disabled}
              />
            }
            enabled={fields['open-flow'].enabled}
          >
            <CRow>
              <CCol>
                <ConfigurationStringField
                  id="open-flow.controller"
                  label="controller"
                  field={fields['open-flow'].controller}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={disabled}
                />
                <ConfigurationSelect
                  id="open-flow.mode"
                  label="mode"
                  field={fields['open-flow'].mode}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  width="100px"
                  disabled={disabled}
                />
                <ConfigurationFileField
                  fileName={fields['open-flow']['ca-certificate-filename'].value}
                  fieldValue={fields['open-flow']['ca-certificate'].value}
                  label="ca-certificate"
                  firstCol="3"
                  secondCol="9"
                  disabled={disabled}
                  errorMessage="Error!!!!"
                  extraButton={
                    <FileToStringButton
                      t={t}
                      title="ca-cert"
                      explanations={t('configuration.ca_cert_explanation')}
                      acceptedFileTypes=".pem"
                      size="sm"
                      save={saveCa}
                      disabled={disabled}
                    />
                  }
                />
                <ConfigurationFileField
                  fileName={fields['open-flow']['ssl-certificate-filename'].value}
                  fieldValue={fields['open-flow']['ssl-certificate'].value}
                  label="ssl-certificate"
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  extraButton={
                    <FileToStringButton
                      t={t}
                      title="ssl-certificate"
                      explanations={t('configuration.key_pem_explanation')}
                      acceptedFileTypes=".pem"
                      size="sm"
                      save={saveSsl}
                      disabled={disabled}
                    />
                  }
                />
                <ConfigurationFileField
                  fileName={fields['open-flow']['private-key-filename'].value}
                  fieldValue={fields['open-flow']['private-key'].value}
                  label="private-key"
                  firstCol="3"
                  secondCol="9"
                  disabled={disabled}
                  errorMessage="Error!!!!"
                  extraButton={
                    <FileToStringButton
                      t={t}
                      title="private-key"
                      explanations={t('configuration.key_pem_explanation')}
                      acceptedFileTypes=".pem"
                      size="sm"
                      save={saveKey}
                      disabled={disabled}
                    />
                  }
                />
              </CCol>
            </CRow>
          </ConfigurationElement>
        </CCol>
      </CRow>
    </div>
  );
};

OpenFlow.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
  batchSetField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default OpenFlow;
