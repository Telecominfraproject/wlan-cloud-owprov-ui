import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AddInventoryTagForm, useAuth, useEntity, useFormFields, useToast } from 'ucentral-libs';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';

const initialForm = {
  serialNumber: {
    value: '',
    error: false,
    required: true,
    regex: '^[a-fA-F0-9]+$',
    length: 12,
  },
  name: {
    value: '',
    error: false,
    required: true,
  },
  deviceType: {
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

const AddInventoryTagModal = ({ entity, show, toggle, refreshTable }) => {
  const { t } = useTranslation();
  const { deviceTypes } = useEntity();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);

  const validation = () => {
    let success = true;

    for (const [key, field] of Object.entries(fields)) {
      if (
        (field.required && field.value === '') ||
        (field.length && field.value.length !== field.length)
      ) {
        updateField(key, { error: true });
        success = false;
        break;
      }
    }
    return success;
  };

  const addInventoryTag = () => {
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        entity: entity.uuid,
        serialNumber: fields.serialNumber.value,
        name: fields.name.value,
        deviceType: fields.deviceType.value,
        description:
          fields.description.value.trim() !== '' ? fields.description.value.trim() : undefined,
        notes: fields.note.value !== '' ? [{ note: fields.note.value }] : undefined,
      };

      axiosInstance
        .post(
          `${endpoints.owprov}/api/v1/inventory/${fields.serialNumber.value}`,
          parameters,
          options,
        )
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('inventory.tag_created'),
            color: 'success',
            autohide: true,
          });
          refreshTable();
          toggle();
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('inventory.tag_creation_error'),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (show) {
      setFormFields(initialForm);
    }
  }, [show]);

  return (
    <CModal className="text-dark" size="lg" show={show} onClose={toggle}>
      <CModalHeader>
        <CModalTitle>{t('inventory.add_tag_to', { name: entity?.name })}</CModalTitle>
      </CModalHeader>
      <CModalBody className="px-5 py-5">
        <AddInventoryTagForm
          t={t}
          disable={loading}
          fields={fields}
          updateField={updateFieldWithId}
          deviceTypes={deviceTypes}
        />
      </CModalBody>
      <CModalFooter>
        <CButton disabled={loading} color="primary" onClick={addInventoryTag}>
          {t('common.add')}
        </CButton>
        <CButton color="secondary" onClick={toggle}>
          {t('common.close')}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

AddInventoryTagModal.propTypes = {
  entity: PropTypes.instanceOf(Object).isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refreshTable: PropTypes.func,
};

AddInventoryTagModal.defaultProps = {
  refreshTable: null,
};

export default AddInventoryTagModal;
