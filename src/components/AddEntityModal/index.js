import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
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
    required: true,
  },
};

const AddEntityModal = ({ show, toggle, refreshEntityChildren }) => {
  const { t } = useTranslation();
  const { entity } = useEntity();
  const { currentToken, endpoints } = useAuth();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        parent: entity.uuid,
        name: fields.name.value,
        description: fields.description.value,
      };

      axiosInstance
        .post(`${endpoints.owprov}/api/v1/entity/1`, parameters, options)
        .then((response) => {
          if (response.data.Code === 0) refreshEntityChildren(entity);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (show) setFormFields(initialForm);
  }, [show]);

  return (
    <CModal className="text-dark" size="lg" show={show} onClose={toggle}>
      <CModalHeader>
        <CModalTitle>Add Child Entity to {entity.name}</CModalTitle>
      </CModalHeader>
      <CModalBody className="px-5">
        <AddEntityForm t={t} disable={loading} fields={fields} updateField={updateFieldWithId} />
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={addEntity}>
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
  refreshEntityChildren: PropTypes.func.isRequired,
};

export default AddEntityModal;
