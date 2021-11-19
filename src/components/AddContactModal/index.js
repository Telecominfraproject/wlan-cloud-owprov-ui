import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AddContactForm, useAuth, useFormFields, useToast } from 'ucentral-libs';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CNav,
  CNavLink,
  CTabContent,
  CTabPane,
  CButton,
  CPopover,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave } from '@coreui/icons';
import ContactsTable from 'components/ContactsTable';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';

const initialForm = {
  name: {
    value: '',
    error: false,
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
  },
  mobiles: {
    value: [],
    error: false,
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
  description: {
    value: '',
    error: false,
  },
  initialNote: {
    value: '',
    error: false,
    ignore: true,
  },
  entity: {
    value: '',
    error: false,
    hidden: false,
    required: true,
  },
};

const AddContactModal = ({ entity, show, toggle, refreshTable }) => {
  const { t } = useTranslation();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState([]);

  const toggleModal = () => {
    if (show) refreshTable();
    toggle();
  };

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

  const addContact = () => {
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {};

      for (const [k, v] of Object.entries(fields)) {
        if (!fields.ignore) parameters[k] = v.value;
      }

      if (fields.initialNote !== '') parameters.notes = [{ note: fields.initialNote.value }];

      if (entity) parameters.entity = entity.uuid;

      axiosInstance
        .post(`${endpoints.owprov}/api/v1/contact/1`, parameters, options)
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('contact.successful_creation'),
            color: 'success',
            autohide: true,
          });
          refreshTable();
          toggleModal();
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('contact.error_creation', { error: e.response?.data?.ErrorDescription }),
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
    let i = 0;
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

  useEffect(() => {
    if (show) {
      if (entity === null) getEntities();
      setActiveTab(0);
      refreshTable();
      const startingForm = initialForm;

      // If this modal is used within an Entity Page, we use the page's entity and hide the field
      if (entity) {
        startingForm.entity.value = entity.uuid;
        startingForm.entity.hidden = true;
      }

      setFormFields(startingForm);
    }
  }, [show]);

  return (
    <CModal size="xl" show={show} onClose={toggleModal}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">Add Contact</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.save')}>
            <CButton
              color="primary"
              variant="outline"
              className="mx-2"
              onClick={addContact}
              disabled={activeTab !== 0}
            >
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggleModal}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody className="pb-5">
        {entity !== null ? (
          <div>
            <CNav variant="tabs">
              <CNavLink
                href="#"
                active={activeTab === 0}
                onClick={() => setActiveTab(0)}
                className="font-weight-bold"
              >
                Create New
              </CNavLink>
              <CNavLink
                href="#"
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
                className="font-weight-bold"
              >
                Already Assigned Contacts
              </CNavLink>
            </CNav>
            <CTabContent className="py-2">
              <CTabPane active={activeTab === 0}>
                <AddContactForm
                  t={t}
                  disable={loading}
                  fields={fields}
                  updateField={updateFieldWithId}
                  updateFieldWithKey={updateField}
                />
              </CTabPane>
              <CTabPane active={activeTab === 1}>
                {show ? <ContactsTable entity={entity} title={t('contact.title')} /> : null}
              </CTabPane>
            </CTabContent>
          </div>
        ) : (
          <AddContactForm
            t={t}
            disable={loading}
            fields={fields}
            updateField={updateFieldWithId}
            updateFieldWithKey={updateField}
            entities={entities}
          />
        )}
      </CModalBody>
    </CModal>
  );
};

AddContactModal.propTypes = {
  entity: PropTypes.instanceOf(Object),
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refreshTable: PropTypes.func,
};

AddContactModal.defaultProps = {
  entity: null,
  refreshTable: null,
};

export default AddContactModal;
