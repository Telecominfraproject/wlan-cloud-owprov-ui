import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CDataTable, CRow, CCol, CButton, CButtonToolbar, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMinus, cilPen } from '@coreui/icons';
import {
  ConfigurationSectionToggler,
  ConfigurationCustomMultiModal,
  ConfigurationStringField,
  ConfigurationToggle,
  ConfigurationElement,
  useFormFields,
  ConfigurationIntField,
  FileToStringButton,
  ConfigurationFileField,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import { LOCAL_USER_FORM } from 'components/DeviceConfigurationBody/constants';

const Ieee8021x = ({ fields, updateField, batchSetField }) => {
  const { t } = useTranslation();
  const saveCa = (value, fileName) => {
    batchSetField([
      { id: 'ieee8021x.ca-certificate', value },
      { id: 'ieee8021x.ca-certificate-filename', value: fileName ?? 'Unknown' },
    ]);
  };
  const saveKey = (value, fileName) => {
    batchSetField([
      { id: 'ieee8021x.private-key', value },
      { id: 'ieee8021x.private-key-filename', value: fileName ?? 'Unknown' },
    ]);
  };
  const saveServ = (value, fileName) => {
    batchSetField([
      { id: 'ieee8021x.server-certificate', value },
      { id: 'ieee8021x.server-certificate-filename', value: fileName ?? 'Unknown' },
    ]);
  };

  // Values for users modal
  const [customFields, updateCustomWithId, , setCustomFields] = useFormFields({
    ...LOCAL_USER_FORM,
  });
  const [tempValue, setTempValue] = useState(fields.ieee8021x.users.value);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formKey, setFormKey] = useState(0); // To ensure re-render

  const columns = [
    { key: 'mac' },
    { key: 'user-name' },
    { key: 'actions', label: '', _style: { width: '10%' } },
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

  const remove = (v, index) => {
    const newList = [...tempValue];
    newList.splice(index, 1);
    setTempValue(newList);
  };

  const toggleAdd = () => {
    const newFields = {
      mac: {
        type: 'string',
        value: '',
        error: false,
        required: true,
        format: 'uc-mac',
      },
      'user-name': {
        type: 'string',
        value: '',
        error: false,
        required: true,
        minLength: 1,
      },
      password: {
        type: 'string',
        value: '',
        error: false,
        required: true,
        minLength: 8,
        maxLength: 63,
      },
      'vlan-id': {
        type: 'int',
        value: '',
        error: false,
        required: true,
        minimum: 0,
        maximum: 4096,
      },
    };
    setCustomFields(newFields, true);
    setEditing(false);
    setCreating(!creating);
    setFormKey(formKey + 1);
  };

  const toggleEditing = (item, index) => {
    setCreating(false);
    setEditing(true);

    const newFields = { ...LOCAL_USER_FORM };
    for (const [k, v] of Object.entries(item)) {
      newFields[k].value = v;
    }

    newFields.index = index;

    setCustomFields({ ...newFields }, true);
    setFormKey(formKey + 1);
  };

  const add = () => {
    const newArray = [...tempValue];
    newArray.push({
      mac: customFields.mac.value,
      'user-name': customFields['user-name'].value,
      password: customFields.password.value,
      'vlan-id': parseInt(customFields['vlan-id'].value, 10),
    });
    setTempValue([...newArray]);
    toggleAdd();
  };

  const saveItem = () => {
    const newArray = [...tempValue];
    const newItem = {
      mac: customFields.mac.value,
      'user-name': customFields['user-name'].value,
      password: customFields.password.value,
      'vlan-id': parseInt(customFields['vlan-id'].value, 10),
    };
    newArray[customFields.index] = newItem;
    setTempValue(newArray);
  };

  const clear = () => {
    setEditing(false);
    setCreating(false);

    setCustomFields({ ...LOCAL_USER_FORM }, true);
    setFormKey(formKey + 1);
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
                <ConfigurationFileField
                  fileName={fields.ieee8021x['ca-certificate-filename'].value}
                  fieldValue={fields.ieee8021x['ca-certificate'].value}
                  label="ca-certificate"
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
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
                <ConfigurationFileField
                  fileName={fields.ieee8021x['server-certificate-filename'].value}
                  fieldValue={fields.ieee8021x['server-certificate'].value}
                  label="server-certificate"
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  extraButton={
                    <FileToStringButton
                      t={t}
                      title="server-certificate"
                      explanations={t('configuration.key_pem_explanation')}
                      acceptedFileTypes=".pem"
                      size="sm"
                      save={saveServ}
                    />
                  }
                />
                <ConfigurationFileField
                  fileName={fields.ieee8021x['private-key-filename'].value}
                  fieldValue={fields.ieee8021x['private-key'].value}
                  label="private-key"
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
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
                  itemName="Users"
                  noTable
                  toggleAdd={toggleAdd}
                  reset={clear}
                >
                  <CRow hidden={!creating && !editing}>
                    <CCol>
                      <ConfigurationStringField
                        id="mac"
                        label="mac"
                        key={`mac${formKey}`}
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
                        key={`user-name${formKey}`}
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
                        key={`password${formKey}`}
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
                        key={`vlan-id${formKey}`}
                        field={customFields['vlan-id']}
                        updateField={updateCustomWithId}
                        firstCol="3"
                        secondCol="9"
                        errorMessage="Error!!!!"
                        disabled={false}
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
                                onClick={() => remove(item, index)}
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

Ieee8021x.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  batchSetField: PropTypes.func.isRequired,
};

export default Ieee8021x;
