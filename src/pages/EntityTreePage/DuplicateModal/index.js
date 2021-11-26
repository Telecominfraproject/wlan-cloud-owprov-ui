import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave } from '@coreui/icons';
import { useFormFields } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import Form from './Form';

const initialForm = {
  name: {
    value: '',
    error: false,
    required: true,
  },
  description: {
    value: '',
    error: false,
  },
  note: {
    value: '',
    error: false,
  },
  visibility: {
    value: 'public',
    error: false,
  },
};

const DuplicateModal = ({ show, toggle, duplicateMap }) => {
  const { t } = useTranslation();
  const [fields, updateFieldWithId, updateField] = useFormFields(initialForm);

  const validation = () => {
    let success = true;

    for (const [key, field] of Object.entries(fields)) {
      if (field.required && field.value === '') {
        updateField(key, { error: true });
        success = false;
        break;
      }
    }

    return success;
  };

  const save = () => {
    if (validation()) {
      duplicateMap({
        name: fields.name.value,
        description: fields.description.value,
        notes: fields.note.value.length > 0 ? [{ note: fields.note.value }] : undefined,
        visibility: fields.visibility.value,
      });
    }
  };

  return (
    <CModal className="text-dark" size="lg" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('entity.duplicate_map')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.add')}>
            <CButton color="primary" variant="outline" onClick={save}>
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody className="px-5">
        <Form t={t} fields={fields} updateField={updateFieldWithId} />
      </CModalBody>
    </CModal>
  );
};

DuplicateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  duplicateMap: PropTypes.func.isRequired,
};

export default DuplicateModal;
