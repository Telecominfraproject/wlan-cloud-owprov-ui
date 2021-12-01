import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalHeader, CModalBody, CModalTitle, CPopover, CButton } from '@coreui/react';
import axiosInstance from 'utils/axiosInstance';
import CIcon from '@coreui/icons-react';
import { cilSave, cilX } from '@coreui/icons';
import { testRegex, validateEmail } from 'utils/helper';
import { useFormFields, useAuth, useToast } from 'ucentral-libs';
import Form from './Form';

const initialState = {
  name: {
    value: '',
    error: false,
    optional: true,
  },
  email: {
    value: '',
    error: false,
  },
  currentPassword: {
    value: '',
    error: false,
  },
  changePassword: {
    value: 'on',
    error: false,
  },
  userRole: {
    value: 'subscriber',
    error: false,
  },
  notes: {
    value: '',
    error: false,
    optional: true,
  },
  description: {
    value: '',
    error: false,
    optional: true,
  },
};

const CreateSubscriberModal = ({ show, toggle, getUsers, policies }) => {
  const { t } = useTranslation();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formFields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialState);

  const toggleChange = () => {
    updateField('changePassword', { value: !formFields.changePassword.value });
  };

  const createUser = () => {
    setLoading(true);

    const parameters = {
      id: 0,
    };

    let validationSuccess = true;

    for (const [key, value] of Object.entries(formFields)) {
      if (!value.optional && value.value === '') {
        validationSuccess = false;
        updateField(key, { value: value.value, error: true });
      } else if (key === 'currentPassword' && !testRegex(value.value, policies.passwordPattern)) {
        validationSuccess = false;
        updateField(key, { value: value.value, error: true });
      } else if (key === 'email' && !validateEmail(value.value)) {
        validationSuccess = false;
        updateField(key, { value: value.value, error: true });
      } else if (key === 'notes') {
        parameters[key] = [{ note: value.value }];
      } else if (key === 'changePassword') {
        parameters[key] = value.value === 'on';
      } else {
        parameters[key] = value.value;
      }
    }

    if (validationSuccess) {
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      };

      axiosInstance
        .post(`${endpoints.owsec}/api/v1/subuser/0`, parameters, {
          headers,
        })
        .then(() => {
          getUsers();
          setFormFields(initialState);
          addToast({
            title: t('common.success'),
            body: t('subscriber.success_create'),
            color: 'success',
            autohide: true,
          });
          toggle();
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('subscriber.error_create', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    setFormFields(initialState);
  }, [show]);

  return (
    <CModal show={show} onClose={toggle} size="xl">
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('subscriber.create')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.create')}>
            <CButton color="primary" variant="outline" onClick={createUser} disabled={loading}>
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
      <CModalBody>
        <Form
          t={t}
          fields={formFields}
          updateField={updateFieldWithId}
          policies={policies}
          toggleChange={toggleChange}
        />
      </CModalBody>
    </CModal>
  );
};

CreateSubscriberModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  policies: PropTypes.instanceOf(Object).isRequired,
};

export default React.memo(CreateSubscriberModal);
