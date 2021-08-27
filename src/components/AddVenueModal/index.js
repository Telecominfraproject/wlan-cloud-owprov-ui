import React, { useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import axiosInstance from 'utils/axiosInstance';
import { useAuth, useFormFields, AddVenueForm } from 'ucentral-libs';

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

const AddVenueModal = ({ show, toggle, parent }) => {
  const { t } = useTranslation();
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
        // parent: parent.type === 'Venue' ? parent.id : undefined,
        entity: parent.type === 'Entity' ? parent.id : undefined,
        name: fields.name.value,
        description: fields.description.value !== '' ? fields.description.value : undefined,
        notes: fields.note.value !== '' ? [{ note: fields.note.value }] : undefined,
      };

      axiosInstance
        .post(`${endpoints.owprov}/api/v1/venue/1`, parameters, options)
        .then(() => {
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
        <CModalTitle>Adding Venue to parent</CModalTitle>
      </CModalHeader>
      <CModalBody className="px-5">
        <AddVenueForm t={t} disable={loading} fields={fields} updateField={updateFieldWithId} />
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

AddVenueModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  parent: PropTypes.instanceOf(Object),
};

AddVenueModal.defaultProps = {
  parent: null,
};

export default AddVenueModal;
