import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave } from '@coreui/icons';
import { useToast, useFormFields, useAuth, useEntity } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import AddConfigurationForm from './Form';

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
  deviceTypes: {
    value: [],
    error: false,
    notEmpty: true,
  },
  rrm: {
    value: 'inherit',
    error: false,
    required: true,
  },
};

const AddConfigurationModal = ({ show, toggle, refresh }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { deviceTypes } = useEntity();
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
      if (field.notEmpty && field.value.length === 0) {
        updateField(key, { error: true, notEmpty: true });
        success = false;
        break;
      }
    }

    return success;
  };

  const addConfiguration = () => {
    if (validation()) {
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
        deviceTypes: fields.deviceTypes.value,
        rrm: fields.rrm.value,
      };

      axiosInstance
        .post(`${endpoints.owprov}/api/v1/configurations/1`, parameters, options)
        .then(() => {
          if (refresh !== null) refresh();
          toggle();
          addToast({
            title: t('common.success'),
            body: t('configuration.creation_success'),
            color: 'success',
            autohide: true,
          });
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('entity.add_failure', { error: e.response?.data?.ErrorDescription }),
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
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('configuration.create')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.add')}>
            <CButton color="primary" variant="outline" className="mx-2" onClick={addConfiguration}>
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
          disable={loading}
          fields={fields}
          updateField={updateFieldWithId}
          updateFieldWithKey={updateField}
          deviceTypes={deviceTypes}
          show={show}
        />
      </CModalBody>
    </CModal>
  );
};

AddConfigurationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refresh: PropTypes.func,
};

AddConfigurationModal.defaultProps = {
  refresh: null,
};

export default AddConfigurationModal;
