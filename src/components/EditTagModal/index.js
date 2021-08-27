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
import {
  useFormFields,
  useAuth,
  useToast,
  useEntity,
  EditInventoryTagForm,
  EntityBrowserProvider,
} from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import EntityBrowser from 'components/EntityBrowser';

const initialForm = {
  entity: {
    value: '',
    error: false,
    hidden: false,
    ignore: true,
  },
  serialNumber: {
    value: '',
    error: false,
    required: true,
    regex: '^[a-fA-F0-9]+$',
    length: 12,
    ignore: true,
  },
  name: {
    value: '',
    error: false,
    required: true,
  },
  description: {
    value: '',
    error: false,
  },
  deviceType: {
    value: '',
    error: false,
    required: true,
  },
  venue: {
    value: '',
    error: false,
  },
  notes: {
    value: [],
    error: false,
    ignore: true,
  },
};

const EditTagModal = ({ show, toggle, tagSerialNumber, refreshTable }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { deviceTypes } = useEntity();
  const { addToast } = useToast();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState([]);
  const [tag, setTag] = useState({});

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

  const getTag = () => {
    setLoading(true);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/inventory/${tagSerialNumber}`, options)
      .then((response) => {
        const newFields = fields;
        for (const [key] of Object.entries(newFields)) {
          if (response.data[key] !== undefined) {
            newFields[key].value = response.data[key];
          }
        }
        setTag(response.data);
        setFormFields({ ...newFields });
      })
      .catch(() => {
        throw new Error('Error while fetching entity for edit');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editTag = () => {
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
          if (tag[key] !== field.value) {
            parameters[key] = field.value;
          }
        }
      }

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/inventory/${tagSerialNumber}`, parameters, options)
        .then(() => {
          getTag();
          if (refreshTable !== null) refreshTable();
          addToast({
            title: t('common.success'),
            body: t('inventory.successful_tag_update'),
            color: 'success',
            autohide: true,
          });
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('inventory.tag_update_error'),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const saveEntity = (newEntityUuid) => {
    if (newEntityUuid !== '0000-0000-0000') {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        entity: newEntityUuid,
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/inventory/${tagSerialNumber}`, parameters, options)
        .then(() => {
          getTag();
          if (refreshTable !== null) refreshTable();
          addToast({
            title: t('common.success'),
            body: t('inventory.successful_tag_update'),
            color: 'success',
            autohide: true,
          });
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('inventory.tag_update_error'),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getVenues = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/venue`, options)
      .then((response) => {
        setVenues(response.data.venues);
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('inventory.error_retrieving'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const addNote = (newNote) => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {
      notes: [{ note: newNote }],
    };

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/inventory/${tagSerialNumber}`, parameters, options)
      .then(() => {
        getTag();
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('inventory.tag_update_error'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
    setLoading(false);
  };

  useEffect(() => {
    if (show) {
      setEntity(null);
      getVenues();
      getTag();
      setFormFields(initialForm);
    }
  }, [show]);

  return (
    <CModal className="text-dark" size="lg" show={show} onClose={toggle}>
      <CModalHeader>
        <CModalTitle>
          {t('common.edit')} {tag.name}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-5">
        <EditInventoryTagForm
          t={t}
          show={show}
          disable={loading}
          fields={fields}
          updateField={updateFieldWithId}
          addNote={addNote}
          deviceTypes={deviceTypes}
          venues={venues}
          entity={entity}
          entityBrowser={
            <div>
              <EntityBrowserProvider show={show}>
                <EntityBrowser selectedEntity={entity} setEntity={setEntity} />
              </EntityBrowserProvider>
            </div>
          }
          saveEntity={saveEntity}
        />
      </CModalBody>
      <CModalFooter>
        <CButton disabled={loading} color="primary" onClick={editTag}>
          {t('common.save')}
        </CButton>
        <CButton color="secondary" onClick={toggle}>
          {t('common.close')}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

EditTagModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refreshTable: PropTypes.func,
  tagSerialNumber: PropTypes.string,
};

EditTagModal.defaultProps = {
  tagSerialNumber: null,
  refreshTable: null,
};

export default EditTagModal;
