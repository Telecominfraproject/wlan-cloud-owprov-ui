import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave } from '@coreui/icons';
import { useFormFields, useAuth, useToast, useEntity, EditContactForm } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';

const initialForm = {
  name: {
    value: '',
    error: false,
    hidden: false,
    required: true,
  },
  type: {
    value: '',
    error: false,
    required: true,
  },
  title: {
    value: '',
    error: false,
  },
  salutation: {
    value: '',
    error: false,
  },
  firstname: {
    value: '',
    error: false,
    required: true,
  },
  lastname: {
    value: '',
    error: false,
    required: true,
  },
  initials: {
    value: '',
    error: false,
  },
  visual: {
    value: '',
    error: false,
  },
  phones: {
    value: [],
    error: false,
    required: false,
  },
  mobiles: {
    value: [],
    error: false,
    required: false,
  },
  primaryEmail: {
    value: '',
    error: false,
    required: true,
  },
  secondaryEmail: {
    value: '',
    error: false,
  },
  accessPIN: {
    value: '',
    error: false,
  },
  notes: {
    value: [],
    error: false,
    ignore: true,
  },
  description: {
    value: '',
    error: false,
  },
  entityName: {
    value: '',
    error: false,
    ignore: true,
  },
  entity: {
    value: '',
    error: false,
    hidden: false,
  },
};

const EditContactModal = ({ show, toggle, contactId, refreshTable }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { deviceTypes } = useEntity();
  const { addToast } = useToast();
  const [fields, updateFieldWithId, updateField, setFormFields, batchSetField] =
    useFormFields(initialForm);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState({});
  const [entities, setEntities] = useState([]);

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

  const getContact = () => {
    setLoading(true);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/contact/${contactId}?withExtendedInfo=true`, options)
      .then((response) => {
        const newFields = fields;
        for (const [key] of Object.entries(newFields)) {
          if (response.data[key] !== undefined) {
            newFields[key].value = response.data[key];
          }
        }
        newFields.entityName.value = response.data.extendedInfo.entity.name;
        setContact(response.data);
        setFormFields({ ...newFields }, true);
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('contact.error_fetching_single', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editContact = () => {
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {};

      for (const [key, field] of Object.entries(fields)) {
        if (!field.ignore) {
          parameters[key] = field.value;
        }
      }

      const newNotes = [];

      for (let i = 0; i < fields.notes.value.length; i += 1) {
        if (fields.notes.value[i].new) newNotes.push({ note: fields.notes.value[i].note });
      }

      parameters.notes = newNotes.length > 1 ? newNotes : undefined;

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/contact/${contactId}`, parameters, options)
        .then(() => {
          toggle();
          if (refreshTable !== null) refreshTable();
          addToast({
            title: t('common.success'),
            body: t('contact.successful_update'),
            color: 'success',
            autohide: true,
          });
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('contact.update_error', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getPartialEntities = async (offset) => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    return axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity?limit=500&offset=${offset}`, { headers })
      .then((response) => response.data.entities)
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('common.general_error'),
          color: 'danger',
          autohide: true,
        });
        return [];
      });
  };

  const getEntities = async () => {
    setLoading(true);

    const allEntites = [];
    let continueGetting = true;
    let i = 1;
    while (continueGetting) {
      // eslint-disable-next-line no-await-in-loop
      const newStuff = await getPartialEntities(i);
      if (newStuff === null || newStuff.length === 0) continueGetting = false;
      allEntites.push(...newStuff);
      i += 500;
    }
    const sorted = allEntites.sort((a, b) => {
      const firstDate = a.created;
      const secondDate = b.created;
      if (firstDate < secondDate) return 1;
      return firstDate > secondDate ? -1 : 0;
    });
    setEntities(sorted);

    setLoading(false);
  };

  const addNote = (newNote) => {
    const newNotes = fields.notes.value;
    newNotes.unshift({
      note: newNote,
      new: true,
      created: new Date().getTime() / 1000,
      createdBy: '',
    });
    updateField('notes', { value: newNotes });
  };

  useEffect(() => {
    if (show) {
      getEntities();
      getContact();
      setFormFields(initialForm);
    }
  }, [show]);

  return (
    <CModal className="text-dark" size="xl" show={show} onClose={() => toggle()}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">
          {t('common.edit')} {contact.name}
        </CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.save')}>
            <CButton color="primary" variant="outline" className="mx-2" onClick={editContact}>
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={() => toggle()}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody className="px-5">
        <EditContactForm
          t={t}
          disable={loading}
          fields={fields}
          updateField={updateFieldWithId}
          updateFieldWithKey={updateField}
          addNote={addNote}
          deviceTypes={deviceTypes}
          entities={entities}
          batchSetField={batchSetField}
        />
      </CModalBody>
    </CModal>
  );
};

EditContactModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refreshTable: PropTypes.func,
  contactId: PropTypes.string,
};

EditContactModal.defaultProps = {
  contactId: null,
  refreshTable: null,
};

export default EditContactModal;
