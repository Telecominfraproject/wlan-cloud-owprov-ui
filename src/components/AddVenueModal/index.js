import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';
import { useTranslation } from 'react-i18next';
import axiosInstance from 'utils/axiosInstance';
import { useAuth, useFormFields, useToast, AddVenueForm } from 'ucentral-libs';

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

const AddVenueModal = ({ show, toggle, parent, refreshMenu }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
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

  const addVenue = () => {
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        ...parent,
        name: fields.name.value,
        description: fields.description.value !== '' ? fields.description.value : undefined,
        notes: fields.note.value !== '' ? [{ note: fields.note.value }] : undefined,
      };

      axiosInstance
        .post(`${endpoints.owprov}/api/v1/venue/1`, parameters, options)
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('inventory.successful_venue_create'),
            color: 'success',
            autohide: true,
          });
          if (parent.entity) {
            refreshMenu('');
          } else {
            refreshMenu(parent.parent);
          }
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('inventory.error_create_venue'),
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
        <CModalTitle>Adding Venue to parent</CModalTitle>
      </CModalHeader>
      <CModalBody className="px-5">
        <AddVenueForm t={t} disable={loading} fields={fields} updateField={updateFieldWithId} />
      </CModalBody>
      <CModalFooter>
        <CButton disabled={loading} color="primary" onClick={addVenue}>
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
  refreshMenu: PropTypes.func.isRequired,
};

AddVenueModal.defaultProps = {
  parent: null,
};

export default AddVenueModal;
