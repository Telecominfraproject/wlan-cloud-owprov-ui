import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';
import { useEntity, useFormFields, useAuth, AddEntityForm } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
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
};

const AddEntityModal = ({
  show,
  toggle,
  needCreateRoot,
  refreshSidebar,
  refreshEntityChildren,
}) => {
  const { t } = useTranslation();
  const { entity } = useEntity();
  const { currentToken, endpoints } = useAuth();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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

  const addEntity = () => {
    if (validation()) {
      setResult(null);
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        parent: needCreateRoot ? undefined : entity.uuid,
        name: fields.name.value,
        description: fields.description.value,
        notes: fields.note.value !== '' ? [fields.note.value] : undefined,
      };

      axiosInstance
        .post(
          `${endpoints.owprov}/api/v1/entity/${needCreateRoot ? '0000-0000-0000' : '1'}`,
          parameters,
          options,
        )
        .then(() => {
          if (needCreateRoot) {
            refreshSidebar();
            toggle();
          } else {
            refreshEntityChildren(entity);
          }
          setResult({
            success: true,
          });
        })
        .catch((e) => {
          setResult({
            success: false,
            error: t('entity.add_failure', { error: e.response?.data }),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const showResult = () => {
    if (!result) return null;
    if (result.success) {
      return <CAlert color="success">{t('entity.add_success')}</CAlert>;
    }
    return <CAlert color="danger">{result.error}</CAlert>;
  };

  useEffect(() => {
    if (show) {
      setResult(null);
      setFormFields(initialForm);
    }
  }, [show]);

  return (
    <CModal className="text-dark" size="lg" show={show} onClose={toggle}>
      <CModalHeader>
        <CModalTitle>
          {needCreateRoot
            ? t('entity.add_root')
            : t('entity.add_child', { entityName: entity?.name })}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-5">
        <AddEntityForm t={t} disable={loading} fields={fields} updateField={updateFieldWithId} />
      </CModalBody>
      <CModalFooter>
        {showResult()}
        <CButton disabled={loading} color="primary" onClick={addEntity}>
          {t('common.add')}
        </CButton>
        <CButton color="secondary" onClick={toggle}>
          {t('common.close')}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

AddEntityModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  needCreateRoot: PropTypes.bool.isRequired,
  refreshSidebar: PropTypes.func.isRequired,
  refreshEntityChildren: PropTypes.func.isRequired,
};

export default AddEntityModal;
