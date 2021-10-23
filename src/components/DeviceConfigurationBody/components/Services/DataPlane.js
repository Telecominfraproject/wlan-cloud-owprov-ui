import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CButton } from '@coreui/react';
import {
  ConfigurationSectionToggler,
  ConfigurationCustomMultiModal,
  ConfigurationElement,
  useFormFields,
  ConfigurationStringField,
} from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const form = {
  name: {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
  program: {
    type: 'string',
    value: '',
    error: false,
    required: true,
    format: 'uc-base64',
  },
};

const DataPlane = ({ fields, updateField }) => {
  const { t } = useTranslation();
  const [customFields, updateCustomWithId, ,] = useFormFields(form);
  const [tempValue, setTempValue] = useState(fields['data-plane']['ingress-filters'].value);

  const columns = [
    { key: 'name', label: t('user.name'), _style: { width: '45%' } },
    { key: 'program', label: t('common.program'), _style: { width: '45%' } },
    { key: 'remove', label: '', _style: { width: '10%' } },
  ];

  const save = () => {
    updateField('data-plane.ingress-filters', { value: [...tempValue] });
  };

  const isValid = () => {
    for (const [, field] of Object.entries(customFields)) {
      if (field.required && field.value === '') return false;
    }
    return true;
  };

  const add = () => {
    const newArray = [...tempValue];
    newArray.push({ name: customFields.name.value, program: customFields.program.value });
    setTempValue([...newArray]);
  };

  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <ConfigurationSectionToggler
                id="data-plane"
                label="data-plane"
                field={fields['data-plane']}
                updateField={updateField}
                firstCol="3"
                secondCol="9"
                disabled={false}
              />
            }
            enabled={fields['data-plane'].enabled}
          >
            <CRow>
              <CCol>
                <ConfigurationCustomMultiModal
                  t={t}
                  id="data-plane.ingress-filters"
                  label="ingress-filters"
                  value={tempValue}
                  updateValue={setTempValue}
                  save={save}
                  columns={columns}
                  firstCol="3"
                  secondCol="9"
                  disabled={false}
                  length={fields['data-plane']['ingress-filters'].value.length}
                  itemName="Ingress Filters"
                >
                  <ConfigurationStringField
                    id="name"
                    label="name"
                    field={customFields.name}
                    updateField={updateCustomWithId}
                    firstCol="3"
                    secondCol="9"
                    errorMessage="Error!!!!"
                    disabled={false}
                  />
                  <ConfigurationStringField
                    id="program"
                    label="program"
                    field={customFields.program}
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

DataPlane.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
};

export default DataPlane;
