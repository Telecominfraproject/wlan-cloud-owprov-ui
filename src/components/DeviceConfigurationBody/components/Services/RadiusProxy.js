/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CDataTable,
  CRow,
  CCol,
  CButton,
  CButtonToolbar,
  CInputFile,
  CPopover,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload, cilMinus, cilPen } from '@coreui/icons';
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

const NEW_FORM = {
  realm: {
    type: 'string',
    value: '*',
    error: false,
    required: true,
  },
  'auto-discover': {
    type: 'bool',
    value: false,
    error: false,
  },
  host: {
    type: 'string',
    value: '',
    error: false,
    format: 'uc-host',
  },
  port: {
    type: 'int',
    value: 2083,
    error: false,
    required: true,
    minimum: 0,
    maximum: 65535,
  },
  secret: {
    type: 'string',
    value: '',
    error: false,
  },
  'use-local-certificates': {
    type: 'bool',
    value: false,
    error: false,
  },
  'ca-certificate': {
    type: 'string',
    value: '',
    error: false,
  },
  'ca-certificate-filename': {
    type: 'string',
    value: '',
    error: false,
  },
  certificate: {
    type: 'string',
    value: '',
    error: false,
  },
  'certificate-filename': {
    type: 'string',
    value: '',
    error: false,
  },
  'private-key': {
    type: 'string',
    value: '',
    error: false,
  },
  'private-key-filename': {
    type: 'string',
    value: '',
    error: false,
  },
  'private-key-password': {
    type: 'string',
    value: '',
    error: false,
  },
};

const RadiusProxy = ({ fields, updateField, disabled }) => {
  const { t } = useTranslation();
  const [customFields, updateCustomWithId, updateCustom, setCustomFields] = useFormFields({
    ...REALMS_FORM,
  });
  const saveCa = (value) => updateCustom('ca-certificate', { value });
  const saveKey = (value) => updateCustom('private-key', { value });
  const saveCert = (value) => updateCustom('certificate', { value });
  const [keyFile, setKeyFile] = useState('');
  const [caFile, setCaFile] = useState('');
  const [certFile, setCertFile] = useState('');
  const [tempValue, setTempValue] = useState(fields['radius-proxy'].realms.value);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formKey, setFormKey] = useState(0); // To ensure re-render

  const columns = [
    { key: 'realm' },
    { key: 'host' },
    { key: 'port', _style: { width: '10%' } },
    { key: 'actions', label: '', _style: { width: '10%' } },
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

  const remove = (index) => {
    const newList = [...tempValue];
    newList.splice(index, 1);
    setTempValue(newList);
  };

  const toggleAdd = () => {
    setEditing(false);
    setCustomFields({ ...NEW_FORM }, true);
    setCreating(!creating);
    setFormKey(formKey + 1);
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
      'ca-certificate-filename': caFile,
      certificate: customFields.certificate.value,
      'certificate-filename': certFile,
      'private-key': customFields['private-key'].value,
      'private-key-filename': keyFile,
      'private-key-password': customFields['private-key-password'].value,
    });
    setTempValue([...newArray]);
    toggleAdd();
  };

  let fileReader;

  const handleCaCertFileRead = () => {
    const content = fileReader.result;
    if (content) {
      saveCa(window.btoa(content));
    }
  };

  const handleCaCertFile = (file) => {
    setCaFile(file.name);
    fileReader = new FileReader();
    fileReader.onloadend = handleCaCertFileRead;
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

  const handleCertFileRead = () => {
    const content = fileReader.result;
    if (content) {
      saveCert(window.btoa(content));
    }
  };

  const handleCertFile = (file) => {
    setCertFile(file.name);
    fileReader = new FileReader();
    fileReader.onloadend = handleCertFileRead;
    fileReader.readAsText(file);
  };

  const toggleEditing = (item, index) => {
    setCreating(false);
    setEditing(true);

    const newFields = { ...REALMS_FORM };
    for (const [k, v] of Object.entries(item)) {
      newFields[k].value = v;
    }
    setKeyFile(item['private-key-filename'] ?? '');
    setCaFile(item['ca-certificate-filename'] ?? '');
    setCertFile(item['certificate-filename'] ?? '');

    newFields.index = index;

    setCustomFields({ ...newFields }, true);
    setFormKey(formKey + 1);
  };

  const saveItem = () => {
    const newArray = [...tempValue];
    const newItem = {
      realm: customFields.realm.value,
      'auto-discover': customFields['auto-discover'].value,
      host: customFields.host.value,
      port: customFields.port.value,
      secret: customFields.secret.value,
      'use-local-certificates': customFields['use-local-certificates'].value,
      'ca-certificate': customFields['ca-certificate'].value,
      'ca-certificate-filename': caFile,
      certificate: customFields.certificate.value,
      'certificate-filename': certFile,
      'private-key': customFields['private-key'].value,
      'private-key-filename': keyFile,
      'private-key-password': customFields['private-key-password'].value,
    };
    newArray[customFields.index] = newItem;
    setTempValue(newArray);
  };

  const clear = () => {
    setEditing(false);
    setCreating(false);
    setKeyFile('');
    setCaFile('');
    setCertFile('');

    setCustomFields({ ...REALMS_FORM }, true);
    setFormKey(formKey + 1);
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
                disabled={disabled}
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
                  firstCol="3"
                  secondCol="9"
                  disabled={disabled}
                  length={fields['radius-proxy'].realms.value.length}
                  modalSize="xl"
                  itemName="Realms"
                  noTable
                  toggleAdd={toggleAdd}
                  reset={clear}
                >
                  <CRow hidden={!creating && !editing}>
                    <CCol>
                      <ConfigurationStringField
                        id="realm"
                        label="realm"
                        field={customFields.realm}
                        key={`key${formKey}`}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={disabled}
                      />
                      <ConfigurationStringField
                        id="host"
                        label="host"
                        key={`host${formKey}`}
                        field={customFields.host}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={disabled}
                      />
                      <ConfigurationStringField
                        id="secret"
                        label="secret"
                        key={`secret${formKey}`}
                        field={customFields.secret}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={disabled}
                      />
                      <ConfigurationFileField
                        fileName={caFile}
                        fieldValue={customFields['ca-certificate'].value}
                        label="ca-certificate"
                        firstCol="4"
                        secondCol="8"
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
                        onChange={(e) => handleCaCertFile(e.target.files[0])}
                      />
                      <ConfigurationFileField
                        fileName={keyFile}
                        fieldValue={customFields['private-key'].value}
                        label="private-key"
                        firstCol="4"
                        secondCol="8"
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
                        key={`auto-discover${formKey}`}
                        field={customFields['auto-discover']}
                        updateField={updateCustom}
                        firstCol="4"
                        secondCol="8"
                        disabled={disabled}
                      />
                      <ConfigurationIntField
                        id="port"
                        label="port"
                        key={`port${formKey}`}
                        field={customFields.port}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={disabled}
                      />
                      <ConfigurationToggle
                        id="use-local-certificates"
                        label="use-local-certificates"
                        key={`use-local-certificates${formKey}`}
                        field={customFields['use-local-certificates']}
                        updateField={updateCustom}
                        firstCol="4"
                        secondCol="8"
                        disabled={disabled}
                      />
                      <ConfigurationFileField
                        fileName={certFile}
                        fieldValue={customFields.certificate.value}
                        label="certificate"
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        extraButton={
                          <label
                            className="btn btn-outline-primary btn-sm"
                            htmlFor="radius-cert-file-input"
                          >
                            <CIcon content={cilCloudUpload} />
                          </label>
                        }
                      />
                      <CInputFile
                        hidden
                        id="radius-cert-file-input"
                        name="radius-cert-file-input"
                        accept=".pem"
                        onChange={(e) => handleCertFile(e.target.files[0])}
                      />
                      <ConfigurationStringField
                        id="private-key-password"
                        label="private-key-password"
                        field={customFields['private-key-password']}
                        key={`private-key-password${formKey}`}
                        updateField={updateCustomWithId}
                        firstCol="4"
                        secondCol="8"
                        errorMessage="Error!!!!"
                        disabled={disabled}
                      />
                    </CCol>
                  </CRow>
                  <CRow hidden={!creating && !editing}>
                    <CCol sm="8" />
                    <CCol>
                      <div hidden={!creating} className="text-right mb-5">
                        <CButton block color="primary" onClick={add} disabled={!isValid()}>
                          {t('common.add')}
                        </CButton>
                      </div>
                      <div hidden={!editing} className=" text-right mb-5">
                        <CButton block color="primary" onClick={saveItem} disabled={!isValid()}>
                          {t('common.save')}
                        </CButton>
                      </div>
                    </CCol>
                    <CCol>
                      <div hidden={!creating} className="text-right mb-5">
                        <CButton block color="danger" onClick={clear}>
                          {t('common.cancel')}
                        </CButton>
                      </div>
                      <div hidden={!editing} className="text-right mb-5">
                        <CButton block color="danger" onClick={clear}>
                          {t('common.close')}
                        </CButton>
                      </div>
                    </CCol>
                  </CRow>
                  <CDataTable
                    addTableClasses="table-sm"
                    items={tempValue ?? []}
                    fields={columns}
                    hover
                    border
                    scopedSlots={{
                      actions: (item, index) => (
                        <td className="align-middle text-center">
                          <CButtonToolbar
                            role="group"
                            className="justify-content-flex-end pl-2"
                            style={{ width: '100px' }}
                          >
                            <CPopover content={t('common.edit')}>
                              <CButton
                                className="ml-1"
                                color="primary"
                                variant="outline"
                                size="sm"
                                onClick={() => toggleEditing(item, index)}
                              >
                                <CIcon content={cilPen} />
                              </CButton>
                            </CPopover>
                            <CPopover content={t('common.delete')}>
                              <CButton
                                className="ml-2"
                                color="primary"
                                variant="outline"
                                size="sm"
                                onClick={() => remove(index)}
                              >
                                <CIcon content={cilMinus} />
                              </CButton>
                            </CPopover>
                          </CButtonToolbar>
                        </td>
                      ),
                    }}
                  />
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
  disabled: PropTypes.bool.isRequired,
};

export default RadiusProxy;
