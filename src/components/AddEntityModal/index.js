import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CPopover,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilPlus } from '@coreui/icons';
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

const AddEntityModal = ({ show, toggle, creatingVenue, refresh }) => {
  const { t } = useTranslation();
  const { entity, rootEntityMissing, getRootEntity, refreshEntityChildren } = useEntity();
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
        name: fields.name.value,
        description: fields.description.value,
        notes: fields.note.value !== '' ? [{ note: fields.note.value }] : undefined,
      };

      if (creatingVenue) {
        if (entity.isVenue) {
          parameters.parent = entity.uuid;
        } else {
          parameters.entity = entity.uuid;
        }
      } else {
        parameters.parent = rootEntityMissing ? undefined : entity.uuid;
      }

      axiosInstance
        .post(
          `${endpoints.owprov}/api/v1/${creatingVenue ? 'venue' : 'entity'}/${
            rootEntityMissing ? '0000-0000-0000' : '1'
          }`,
          parameters,
          options,
        )
        .then(() => {
          if (rootEntityMissing) {
            getRootEntity();
            toggle();
          } else {
            refreshEntityChildren(entity);
          }
          setResult({
            success: true,
          });
          if (refresh !== null) refresh();
        })
        .catch((e) => {
          setResult({
            success: false,
            error: creatingVenue
              ? t('inventory.error_create_venue')
              : t('entity.add_failure', { error: e.response?.data }),
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
      return (
        <CAlert color="success" className="px-3">
          {creatingVenue ? t('inventory.successful_venue_create') : t('entity.add_success')}
        </CAlert>
      );
    }
    return (
      <CAlert color="danger" className="px-3">
        {result.error}
      </CAlert>
    );
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
          {creatingVenue
            ? t('inventory.add_child_venue', { entityName: entity?.name })
            : t('entity.add_child', { entityName: entity?.name })}
        </CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.add')}>
            <CButton color="primary" variant="outline" className="mx-2" onClick={addEntity}>
              <CIcon content={cilPlus} />
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
        <AddEntityForm t={t} disable={loading} fields={fields} updateField={updateFieldWithId} />
      </CModalBody>
      {showResult()}
    </CModal>
  );
};

AddEntityModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  creatingVenue: PropTypes.bool.isRequired,
  refresh: PropTypes.func,
};

AddEntityModal.defaultProps = {
  refresh: null,
};

export default AddEntityModal;
