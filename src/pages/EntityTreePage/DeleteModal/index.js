import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CPopover, CRow, CCol, CAlert } from '@coreui/react';
import { Modal } from 'ucentral-libs';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';

const DeleteModal = ({ show, toggle, treeInfo, deleteMap }) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={show}
      toggle={toggle}
      title={`${t('common.delete')} ${treeInfo.name}`}
      headerButtons={
        <CPopover content={t('common.close')}>
          <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
            <CIcon content={cilX} />
          </CButton>
        </CPopover>
      }
    >
      <CAlert className="my-3" color="danger">
        {t('entity.confirm_map_delete', { name: treeInfo.name })}
      </CAlert>
      <CRow className="mb-2">
        <CCol className="text-right">
          <CButton onClick={deleteMap} color="danger">
            {t('common.delete')}
          </CButton>
        </CCol>
        <CCol>
          <CButton onClick={toggle} color="light">
            {t('common.cancel')}
          </CButton>
        </CCol>
      </CRow>
    </Modal>
  );
};

DeleteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  treeInfo: PropTypes.instanceOf(Object).isRequired,
  deleteMap: PropTypes.func.isRequired,
};

export default DeleteModal;
