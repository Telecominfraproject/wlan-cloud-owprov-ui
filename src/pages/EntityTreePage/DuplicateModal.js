import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave } from '@coreui/icons';
import { useFormFields, AddConfigurationForm } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

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
    value: [],
    error: false,
    notEmpty: true,
  },
};

const DuplicateModal = ({ show, toggle, duplicateMap }) => {
  const { t } = useTranslation();
  const [fields, updateFieldWithId, updateField] = useFormFields(initialForm);

  const save = () => {
    duplicateMap({});
  };

  return (
    <CModal className="text-dark" size="lg" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('configuration.create')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.add')}>
            <CButton color="primary" variant="outline" className="mx-2" onClick={save}>
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
        <AddConfigurationForm
          t={t}
          disable={null}
          fields={fields}
          updateField={updateFieldWithId}
          updateFieldWithKey={updateField}
          deviceTypes={null}
          show={show}
        />
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
