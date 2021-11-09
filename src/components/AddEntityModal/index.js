import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
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
import { cilX, cilSave } from '@coreui/icons';
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
  rrm: {
    value: 'inherit',
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
  const location = useLocation();
  const history = useHistory();
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
        rrm: fields.rrm.value,
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

          const queryParams = new URLSearchParams(location.search);
          queryParams.append('new', creatingVenue ? 'venue' : 'entity');
          history.replace({
            search: queryParams.toString(),
          });

          toggle();
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
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">
          {creatingVenue
            ? t('inventory.add_child_venue', { entityName: entity?.name })
            : t('entity.add_child', { entityName: entity?.name })}
        </CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.save')}>
            <CButton color="primary" variant="outline" onClick={addEntity}>
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
        <AddEntityForm
          t={t}
          disable={loading}
          fields={fields}
          updateField={updateFieldWithId}
          updateFieldDirectly={updateField}
        />
      </CModalBody>
      {showResult()}
    </CModal>
  );
};

AddEntityModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  creatingVenue: PropTypes.bool,
  refresh: PropTypes.func,
};

AddEntityModal.defaultProps = {
  refresh: null,
  creatingVenue: false,
};

export default AddEntityModal;
