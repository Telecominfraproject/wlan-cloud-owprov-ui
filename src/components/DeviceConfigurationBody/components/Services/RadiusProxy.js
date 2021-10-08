/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CButton, CInputFile } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload } from '@coreui/icons';
import {
  ConfigurationSectionToggler,
  ConfigurationCustomMultiModal,
  ConfigurationElement,
  useFormFields,
  ConfigurationStringField,
  ConfigurationIntField,
  ConfigurationToggle,
  ConfigurationFileField,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import { REALMS_FORM } from 'components/DeviceConfigurationBody/constants';

const RadiusProxy = ({ fields, updateField }) => {
  const { t } = useTranslation();
  const [customFields, updateCustomWithId, updateCustom] = useFormFields(REALMS_FORM);
  const saveCa = (value) => updateCustom('ca-certificate', { value });
  const saveKey = (value) => updateCustom('private-key', { value });
  const [keyFile, setKeyFile] = useState('');
  const [certFile, setCertFile] = useState('');
  const [tempValue, setTempValue] = useState(fields['radius-proxy'].realms.value);

  const columns = [
    { key: 'realm', _style: { width: '9%' } },
    { key: 'auto-discover', _style: { width: '9%' } },
    { key: 'host', _style: { width: '9%' } },
    { key: 'port', _style: { width: '9%' } },
    { key: 'secret', _style: { width: '9%' } },
    { key: 'use-local-certificates', _style: { width: '9%' } },
    { key: 'ca-certificate', _style: { width: '9%' } },
    { key: 'certificate', _style: { width: '9%' } },
    { key: 'private-key', _style: { width: '9%' } },
    { key: 'private-key-password', _style: { width: '9%' } },
    { key: 'remove', label: '', _style: { width: '10%' } },
  ];

  const save = () => {
    updateField('radius-proxy.realms', { value: [...tempValue] });
  };

  const isValid = () => {
    for (const [, field] of Object.entries(customFields)) {
      if (field.required && field.value === '') return false;
    }
    return true;
  };

  const add = () => {
    const newArray = [...tempValue];
    newArray.push({
      realm: customFields.realm.value,
      'auto-discover': customFields['auto-discover'].value,
      host: customFields.host.value,
      port: customFields.port.value,
      secret: customFields.secret.value,
      'use-local-certificates': customFields['use-local-certificates'].value,
      'ca-certificate': customFields['ca-certificate'].value,
      'ca-certificate-filename': certFile,
      certificate: customFields.certificate.value,
      'private-key': customFields['private-key'].value,
      'private-key-filename': keyFile,
      'private-key-password': customFields['private-key-password'].value,
    });
    setTempValue([...newArray]);
  };

  let fileReader;

  const handleCertFileRead = () => {
    const content = fileReader.result;
    if (content) {
      saveCa(window.btoa(content));
    }
  };

  const handleCertFile = (file) => {
    setCertFile(file.name);
    fileReader = new FileReader();
    fileReader.onloadend = handleCertFileRead;
    fileReader.readAsText(file);
  };

  const handleKeyFileRead = () => {
    const content = fileReader.result;
    if (content) {
      saveKey(window.btoa(content));
    }
  };

  const handleKeyFile = (file) => {
    setKeyFile(file.name);
    fileReader = new FileReader();
    fileReader.onloadend = handleKeyFileRead;
    fileReader.readAsText(file);
  };

  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <ConfigurationSectionToggler
                id="radius-proxy"
                label="radius-proxy"
                field={fields['radius-proxy']}
                updateField={updateField}
                firstCol="4"
                secondCol="8"
                disabled={false}
              />
            }
            enabled={fields['radius-proxy'].enabled}
          >
            <CRow>
              <CCol>
                <ConfigurationCustomMultiModal
                  t={t}
                  id="radius-proxy.realms"
                  label="realms"
                  value={tempValue}
                  updateValue={setTempValue}
                  save={save}
                  columns={columns}
                  firstCol="4"
                  secondCol="8"
                  disabled={false}
                  length={fields['radius-proxy'].realms.value.length}
                  modalSize="xl"
                >
                  <CRow>
                    <CCol>
                      <ConfigurationStringField
                        id="realm"
                        label="realm"
                        field={customFields.realm}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                      <ConfigurationStringField
                        id="host"
                        label="host"
                        field={customFields.host}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                      <ConfigurationStringField
                        id="secret"
                        label="secret"
                        field={customFields.secret}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                      <ConfigurationFileField
                        fileName={certFile}
                        fieldValue={customFields['ca-certificate'].value}
                        label="ca-certificate"
                        firstCol="3"
                        secondCol="9"
                        errorMessage="Error!!!!"
                        extraButton={
                          <label
                            className="btn btn-outline-primary btn-sm"
                            htmlFor="radius-ca-file-input"
                          >
                            <CIcon content={cilCloudUpload} />
                          </label>
                        }
                      />
                      <CInputFile
                        hidden
                        id="radius-ca-file-input"
                        name="radius-ca-file-input"
                        accept=".pem"
                        onChange={(e) => handleCertFile(e.target.files[0])}
                      />
                      <ConfigurationFileField
                        fileName={keyFile}
                        fieldValue={customFields['private-key'].value}
                        label="private-key"
                        firstCol="3"
                        secondCol="9"
                        errorMessage="Error!!!!"
                        extraButton={
                          <label
                            className="btn btn-outline-primary btn-sm"
                            htmlFor="radius-key-file-input"
                          >
                            <CIcon content={cilCloudUpload} />
                          </label>
                        }
                      />
                      <CInputFile
                        hidden
                        id="radius-key-file-input"
                        name="radius-key-file-input"
                        accept=".pem"
                        onChange={(e) => handleKeyFile(e.target.files[0])}
                      />
                    </CCol>
                    <CCol>
                      <ConfigurationToggle
                        id="auto-discover"
                        label="auto-discover"
                        field={customFields['auto-discover']}
                        updateField={updateCustom}
                        firstCol="4"
                        secondCol="8"
                        disabled={false}
                      />
                      <ConfigurationIntField
                        id="port"
                        label="port"
                        field={customFields.port}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                      <ConfigurationToggle
                        id="use-local-certificates"
                        label="use-local-certificates"
                        field={customFields['use-local-certificates']}
                        updateField={updateCustom}
                        firstCol="4"
                        secondCol="8"
                        disabled={false}
                      />
                      <ConfigurationStringField
                        id="certificate"
                        label="certificate"
                        field={customFields.certificate}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                      <ConfigurationStringField
                        id="private-key-password"
                        label="private-key-password"
                        field={customFields['private-key-password']}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                    </CCol>
                  </CRow>
                  <div className="text-right mb-5">
                    <CButton className="w-25" color="primary" onClick={add} disabled={!isValid()}>
                      {t('common.add')}
                    </CButton>
                  </div>
                </ConfigurationCustomMultiModal>
              </CCol>
            </CRow>
          </ConfigurationElement>
        </CCol>
      </CRow>
    </div>
  );
};

RadiusProxy.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
};

export default RadiusProxy;
