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
import { useEntity, useFormFields, useAuth, EditEntityForm } from 'ucentral-libs';
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
  notes: {
    value: [],
    error: false,
  },
};

const EditEntityModal = ({ show, toggle }) => {
  const { t } = useTranslation();
  const { entity, setEntity, refreshEntity } = useEntity();
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

  const editEntity = () => {
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
        uuid: entity.uuid,
        name: fields.name.value,
        description: fields.description.value,
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/entity/${entity.uuid}`, parameters, options)
        .then(() => {
          refreshEntity(entity.path, {
            name: fields.name.value,
          });
          setEntity({
            ...entity,
            ...{
              name: fields.name.value,
            },
          });
          setResult({
            success: true,
          });
        })
        .catch((e) => {
          setResult({
            success: false,
            error: t('entity.add_failure', e.response?.data),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getEntity = () => {
    setLoading(true);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity/${entity.uuid}`, options)
      .then((response) => {
        const newFields = fields;
        for (const [key] of Object.entries(newFields)) {
          if (response.data[key] !== undefined) {
            newFields[key].value = response.data[key];
          }
        }
        setFormFields({ ...newFields });
      })
      .catch(() => {
        throw new Error('Error while fetching entity for edit');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addNote = (newNote) => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {
      uuid: entity.uuid,
      notes: [{ note: newNote }],
    };

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/entity/${entity.uuid}`, parameters, options)
      .then(() => {
        getEntity();
      })
      .catch((e) => {
        setResult({
          success: false,
          error: t('entity.edit_failure', { error: e.response?.data }),
        });
      })
      .finally(() => {
        setLoading(false);
      });
    setLoading(false);
  };

  const showResult = () => {
    if (!result) return null;
    if (result.success) {
      return <CAlert color="success">{t('common.saved')}</CAlert>;
    }
    return <CAlert color="danger">{result.error}</CAlert>;
  };

  useEffect(() => {
    if (show) {
      getEntity();
      setResult(null);
      setFormFields(initialForm);
    }
  }, [show, entity]);

  return (
    <CModal className="text-dark" size="lg" show={show} onClose={toggle}>
      <CModalHeader>
        <CModalTitle>
          {t('common.edit')} {entity?.name}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-5">
        <EditEntityForm
          t={t}
          disable={loading}
          fields={fields}
          updateField={updateFieldWithId}
          addNote={addNote}
        />
      </CModalBody>
      <CModalFooter>
        {showResult()}
        <CButton disabled={loading} color="primary" onClick={editEntity}>
          {t('common.save')}
        </CButton>
        <CButton color="secondary" onClick={toggle}>
          {t('common.close')}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

EditEntityModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default EditEntityModal;
