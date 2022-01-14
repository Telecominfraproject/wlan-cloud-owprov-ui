import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import axiosInstance from 'utils/axiosInstance';
import { useAuth, useToast, useFormFields } from 'ucentral-libs';
import { testRegex } from 'utils/helper';
import Modal from './Modal';

const initialState = {
  Id: {
    value: '',
    error: false,
    editable: false,
  },
  changePassword: {
    value: false,
    error: false,
    editable: true,
  },
  currentPassword: {
    value: '',
    error: false,
    editable: true,
  },
  email: {
    value: '',
    error: false,
    editable: false,
  },
  description: {
    value: '',
    error: false,
    editable: true,
  },
  name: {
    value: '',
    error: false,
    editable: true,
  },
  fieldsRole: {
    value: 'subscriber',
    error: false,
    editable: true,
  },
  notes: {
    value: [],
    editable: false,
  },
};

const EditSubscriberModal = ({ show, toggle, userId, getUsers, policies }) => {
  const { t } = useTranslation();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [initialDevices, setInitialDevices] = useState([]);
  const [newDevices, setNewDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fields, updateWithId, updateWithKey, setFormFields] = useFormFields({ ...initialState });

  const validation = () => {
    let success = true;

    for (const [key, field] of Object.entries(fields)) {
      if (field.required && field.value === '') {
        updateWithKey(key, { error: true });
        success = false;
        break;
      }
      if (
        key === 'currentPassword' &&
        field.value !== '' &&
        !testRegex(field.value, policies.passwordPattern)
      ) {
        updateWithKey(key, { error: true });
        success = false;
        break;
      }
    }
    return success;
  };

  const getUser = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owsec}/api/v1/subuser/${userId}`, options)
      .then((response) => {
        const newUser = {};

        for (const key of Object.keys(response.data)) {
          if (key in initialState && key !== 'currentPassword') {
            newUser[key] = {
              ...initialState[key],
              value: response.data[key],
            };
          }
        }
        setFormFields({ ...initialState, ...newUser });

        return axiosInstance.get(
          `${endpoints.owprov}/api/v1/inventory?subscriber=${userId}&withExtendedInfo=true`,
          options,
        );
      })
      .then((response) => {
        setInitialDevices([...response.data.taglist]);
        setNewDevices([...response.data.taglist]);
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('subscriber.error_fetching_single'),
          color: 'danger',
          autohide: true,
        });
        toggle();
      });
  };

  const toggleEditing = () => {
    if (editing) {
      getUser();
    }
    setEditing(!editing);
  };

  const getDeviceRequests = useCallback(() => {
    const toRemove = initialDevices.filter(
      (old) => !newDevices.find((edited) => edited.id === old.id),
    );
    const toAdd = newDevices.filter(
      (edited) => !initialDevices.find((old) => edited.id === old.id),
    );
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const removePromises = toRemove.map(async (device) =>
      axiosInstance.put(
        `${endpoints.owprov}/api/v1/inventory/${device.serialNumber}`,
        { subscriber: '' },
        options,
      ),
    );
    const addPromises = toAdd.map(async (device) =>
      axiosInstance.put(
        `${endpoints.owprov}/api/v1/inventory/${device.serialNumber}`,
        { subscriber: userId },
        options,
      ),
    );

    return [...removePromises, ...addPromises];
  }, [initialDevices, newDevices]);

  const updateUser = async () => {
    if (validation()) {
      setLoading(true);

      const parameters = {
        name: fields.name.value,
        changePassword: fields.changePassword.value === 'on',
        description: fields.description.value,
        currentPassword:
          fields.currentPassword.value !== '' ? fields.currentPassword.value : undefined,
      };

      const newNotes = [];

      for (let i = 0; i < fields.notes.value.length; i += 1) {
        if (fields.notes.value[i].new) newNotes.push({ note: fields.notes.value[i].note });
      }

      parameters.notes = newNotes;

      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      getDeviceRequests();

      axiosInstance
        .put(`${endpoints.owsec}/api/v1/subuser/${userId}`, parameters, options)
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('subscriber.success_update'),
            color: 'success',
            autohide: true,
          });
          getUsers();
          toggle();
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('subscriber.error_update', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
          getUser();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const addNote = (currentNote) => {
    const newNotes = [...fields.notes.value];
    newNotes.unshift({
      note: currentNote,
      new: true,
      created: new Date().getTime() / 1000,
      createdBy: '',
    });
    updateWithKey('notes', { value: newNotes });
  };

  useEffect(() => {
    if (show) {
      getUser();
      setEditing(false);
    }
  }, [show, userId]);

  return (
    <Modal
      t={t}
      fields={fields}
      updateUserWithId={updateWithId}
      saveUser={updateUser}
      loading={loading}
      policies={policies}
      show={show}
      toggle={toggle}
      editing={editing}
      toggleEditing={toggleEditing}
      serialNumbers={newDevices}
      setSerialNumbers={setNewDevices}
      addNote={addNote}
    />
  );
};

EditSubscriberModal.propTypes = {
  userId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  policies: PropTypes.instanceOf(Object).isRequired,
};

export default React.memo(EditSubscriberModal);
