import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CButton } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationCustomMultiModal,
  ConfigurationStringField,
  ConfigurationToggle,
  ConfigurationElement,
  useFormFields,
  ConfigurationIntField,
  FileToStringButton,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import { LOCAL_USER_FORM } from 'components/DeviceConfigurationBody/constants';

const Ieee8021x = ({ fields, updateField, updateWithId }) => {
  const { t } = useTranslation();
  const saveCa = (value) => updateField('ieee8021x.ca-certificate', { value });
  const saveKey = (value) => updateField('ieee8021x.private-key', { value });
  const [customFields, updateCustomWithId, ,] = useFormFields(LOCAL_USER_FORM);
  const [tempValue, setTempValue] = useState(fields.ieee8021x.users.value);

  const columns = [
    { key: 'mac', _style: { width: '30%' } },
    { key: 'user-name', _style: { width: '20%' } },
    { key: 'password', _style: { width: '30%' } },
    { key: 'vlan-id', _style: { width: '15%' } },
    { key: 'remove', label: '', _style: { width: '5%' } },
  ];

  const save = () => {
    updateField('ieee8021x.users', { value: [...tempValue] });
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
      mac: customFields.mac.value,
      'user-name': customFields['user-name'].value,
      password: customFields.password.value,
      'vlan-id': customFields['vlan-id'].value,
    });
    setTempValue([...newArray]);
  };

  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <ConfigurationSectionToggler
                id="ieee8021x"
                label="ieee8021x"
                field={fields.ieee8021x}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            }
            enabled={fields.ieee8021x.enabled}
          >
            <CRow>
              <CCol>
                <ConfigurationStringField
                  id="ieee8021x.ca-certificate"
                  label="ca-certificate"
                  field={fields.ieee8021x['ca-certificate']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                  extraButton={
                    <FileToStringButton
                      t={t}
                      title="ca-cert"
                      explanations={t('configuration.ca_cert_explanation')}
                      acceptedFileTypes=".pem"
                      size="sm"
                      save={saveCa}
                    />
                  }
                />
                <ConfigurationToggle
                  id="ieee8021x.use-local-certificate"
                  label="use-local-certificate"
                  field={fields.ieee8021x['use-local-certificate']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled={false}
                />
                <ConfigurationStringField
                  id="ieee8021x.server-certificate"
                  label="server-certificate"
                  field={fields.ieee8021x['server-certificate']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
                <ConfigurationStringField
                  id="ieee8021x.private-key"
                  label="private-key"
                  field={fields.ieee8021x['private-key']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                  extraButton={
                    <FileToStringButton
                      t={t}
                      title="private-key"
                      explanations={t('configuration.key_pem_explanation')}
                      acceptedFileTypes=".pem"
                      size="sm"
                      save={saveKey}
                    />
                  }
                />
                <ConfigurationCustomMultiModal
                  t={t}
                  id="ieee8021x.users"
                  label="users"
                  value={tempValue}
                  updateValue={setTempValue}
                  save={save}
                  columns={columns}
                  firstCol="3"
                  secondCol="9"
                  disabled={false}
                  length={fields.ieee8021x.users.value.length}
                >
                  <ConfigurationStringField
                    id="mac"
                    label="mac"
                    field={customFields.mac}
                    updateField={updateCustomWithId}
                    firstCol="3"
                    secondCol="9"
                    errorMessage="Error!!!!"
                    disabled={false}
                  />
                  <ConfigurationStringField
                    id="user-name"
                    label="user-name"
                    field={customFields['user-name']}
                    updateField={updateCustomWithId}
                    firstCol="3"
                    secondCol="9"
                    errorMessage="Error!!!!"
                    disabled={false}
                  />
                  <ConfigurationStringField
                    id="password"
                    label="password"
                    field={customFields.password}
                    updateField={updateCustomWithId}
                    firstCol="3"
                    secondCol="9"
                    errorMessage="Error!!!!"
                    disabled={false}
                  />
                  <ConfigurationIntField
                    id="vlan-id"
                    label="vlan-id"
                    field={customFields['vlan-id']}
                    updateField={updateCustomWithId}
                    firstCol="3"
                    secondCol="9"
                    errorMessage="Error!!!!"
                    disabled={false}
                  />
                  <div className="text-right my-3">
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

Ieee8021x.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateWithId: PropTypes.func.isRequired,
};

export default Ieee8021x;
