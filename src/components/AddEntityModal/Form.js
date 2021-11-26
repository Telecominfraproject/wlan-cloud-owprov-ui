import React from 'react';
import { CForm, CInput, CLabel, CCol, CFormGroup, CFormText, CRow } from '@coreui/react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { SELECT_STYLES } from 'ucentral-libs';

const AddEntityForm = ({ t, disable, fields, updateField, updateFieldDirectly }) => (
  <CForm>
    <CFormGroup row className="pb-3">
      <CLabel col htmlFor="name">
        {t('user.name')}
      </CLabel>
      <CCol sm="7">
        <CInput
          id="name"
          type="text"
          required
          value={fields.name.value}
          onChange={updateField}
          invalid={fields.name.error}
          disabled={disable}
          maxLength="50"
        />
        <CFormText color={fields.name.error ? 'danger' : ''}>{t('common.required')}</CFormText>
      </CCol>
    </CFormGroup>
    <CFormGroup row className="pb-3">
      <CLabel col htmlFor="description">
        {t('user.description')}
      </CLabel>
      <CCol sm="7">
        <CInput
          id="description"
          type="text"
          required
          value={fields.description.value}
          onChange={updateField}
          disabled={disable}
          maxLength="50"
        />
      </CCol>
    </CFormGroup>
    <CRow className="pb-3">
      <CLabel sm="5" col htmlFor="name">
        <div>RRM:</div>
      </CLabel>
      <CCol sm="7">
        <div style={{ width: '120px' }}>
          <Select
            id="rrm"
            styles={SELECT_STYLES}
            value={{ value: fields.rrm.value, label: fields.rrm.value }}
            onChange={(v) => updateFieldDirectly('rrm', { value: v.value })}
            options={[
              { label: 'on', value: 'on' },
              { label: 'off', value: 'off' },
              { label: 'inherit', value: 'inherit' },
            ]}
            isDisabled={disable}
          />
        </div>
      </CCol>
    </CRow>
    <CFormGroup row className="pb-3">
      <CLabel col htmlFor="note">
        {t('user.note')}
      </CLabel>
      <CCol sm="7">
        <CInput
          id="note"
          type="text"
          required
          value={fields.note.value}
          onChange={updateField}
          invalid={fields.note.error}
          disabled={disable}
        />
      </CCol>
    </CFormGroup>
  </CForm>
);

AddEntityForm.propTypes = {
  t: PropTypes.func.isRequired,
  disable: PropTypes.bool.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldDirectly: PropTypes.func.isRequired,
};

export default AddEntityForm;
