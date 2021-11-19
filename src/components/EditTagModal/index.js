import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CPopover,
  CNav,
  CNavLink,
  CTabPane,
  CTabContent,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave, cilPen, cilRouter } from '@coreui/icons';
import {
  useFormFields,
  useAuth,
  useToast,
  useEntity,
  EditInventoryTagForm,
  DetailedNotesTable,
} from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';

const initialForm = {
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
  rrm: {
    value: 'inherit',
    error: false,
    required: true,
  },
  deviceConfiguration: {
    value: '',
    uuid: '',
    error: false,
    ignore: true,
  },
  venue: {
    value: '',
    error: false,
  },
  entity: {
    value: '',
    error: false,
  },
  notes: {
    value: [],
    error: false,
    ignore: true,
  },
  entityName: {
    value: '',
    error: false,
    ignore: true,
  },
  venueName: {
    value: '',
    error: false,
    ignore: true,
  },
};

const EditTagModal = ({ show, toggle, tagSerialNumber, refreshTable, pushConfig }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { deviceTypes } = useEntity();
  const { addToast } = useToast();
  const [hasConfig, setHasConfig] = useState(false);
  const [fields, updateFieldWithId, updateField, setFormFields, batchSetField] =
    useFormFields(initialForm);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState({});
  const [editing, setEditing] = useState(false);
  const [index, setIndex] = useState(0);
  const [entities, setEntities] = useState([]);
  const [venues, setVenues] = useState([]);

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
      .get(`${endpoints.owprov}/api/v1/inventory/${tagSerialNumber}?withExtendedInfo=true`, options)
      .then((response) => {
        const newFields = fields;
        for (const [key] of Object.entries(newFields)) {
          if (response.data[key] !== undefined) {
            if (key === 'deviceConfiguration')
              newFields.deviceConfiguration = { value: '', uuid: response.data[key] };
            else if (key === 'rrm')
              newFields[key].value = response.data[key] === '' ? 'inherit' : response.data[key];
            else newFields[key].value = response.data[key];
          }
        }
        newFields.entityName.value = response.data.extendedInfo?.entity?.name ?? '';
        newFields.venueName.value = response.data.extendedInfo?.venue?.name ?? '';
        setTag(response.data);
        setFormFields({ ...newFields }, true);

        if (response.data.deviceConfiguration !== '') {
          setHasConfig(true);
          return axiosInstance.get(
            `${endpoints.owprov}/api/v1/configurations/${response.data.deviceConfiguration}`,
            options,
          );
        }
        return null;
      })
      .then((response) => {
        if (response)
          updateField('deviceConfiguration', { value: response.data.name, uuid: response.data.id });
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
          if (key === 'deviceConfiguration') {
            if (tag[key] !== field.uuid) {
              parameters[key] = field.uuid;
            }
          } else if (tag[key] !== field.value) {
            parameters[key] = field.value;
          }
        }
      }

      const newNotes = [];

      for (let i = 0; i < fields.notes.value.length; i += 1) {
        if (fields.notes.value[i].new) newNotes.push({ note: fields.notes.value[i].note });
      }

      parameters.notes = newNotes;

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
          toggle();
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

  const getPartialEntities = async (offset, isVenue) => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    return axiosInstance
      .get(
        `${endpoints.owprov}/api/v1/${isVenue ? 'venue' : 'entity'}?limit=500&offset=${offset}`,
        { headers },
      )
      .then((response) => response.data.entities ?? response.data.venues)
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

    const allEntities = [];
    let continueGetting = true;
    let i = 0;
    while (continueGetting) {
      // eslint-disable-next-line no-await-in-loop
      const newStuff = await getPartialEntities(i, false);
      if (newStuff === null || newStuff.length === 0) continueGetting = false;
      allEntities.push(...newStuff);
      i += 500;
    }
    const sortedEntities = allEntities.sort((a, b) => {
      const firstDate = a.created;
      const secondDate = b.created;
      if (firstDate < secondDate) return 1;
      return firstDate > secondDate ? -1 : 0;
    });
    setEntities(sortedEntities);

    const allVenues = [];
    continueGetting = true;
    i = 1;
    while (continueGetting) {
      // eslint-disable-next-line no-await-in-loop
      const newStuff = await getPartialEntities(i, true);
      if (newStuff === null || newStuff.length === 0) continueGetting = false;
      allVenues.push(...newStuff);
      i += 500;
    }
    const sortedVenues = allVenues.sort((a, b) => {
      const firstDate = a.created;
      const secondDate = b.created;
      if (firstDate < secondDate) return 1;
      return firstDate > secondDate ? -1 : 0;
    });
    setVenues(sortedVenues);

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

  const pushConfigToDevice = () => {
    pushConfig(fields.serialNumber.value);
    toggle();
  };

  const toggleEdit = () => {
    if (editing) getTag();
    setEditing(!editing);
  };

  useEffect(() => {
    if (show) {
      getEntities();
      setHasConfig(false);
      setIndex(0);
      getTag();
      setFormFields(initialForm);
    } else {
      setEditing(false);
    }
  }, [show]);

  return (
    <CModal className="text-dark" size="lg" show={show} onClose={() => toggle()}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">
          {t('common.edit')} {tag.name}
        </CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.save')}>
            <CButton color="primary" variant="outline" onClick={editTag} disabled={!editing}>
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.edit')}>
            <CButton
              color="primary"
              variant="outline"
              className="ml-2"
              onClick={toggleEdit}
              disabled={editing}
            >
              <CIcon content={cilPen} />
            </CButton>
          </CPopover>
          <CPopover content="Push Configuration to Device">
            <CButton
              color="primary"
              variant="outline"
              className="ml-2"
              onClick={pushConfigToDevice}
              disabled={!hasConfig}
            >
              <CIcon name="cil-router" content={cilRouter} size="sm" />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={() => toggle()}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody className="px-3 pt-0">
        <CNav variant="tabs" className="mb-0 p-0">
          <CNavLink
            className="font-weight-bold"
            href="#"
            active={index === 0}
            onClick={() => setIndex(0)}
          >
            {t('common.main')}
          </CNavLink>
          <CNavLink
            className="font-weight-bold"
            href="#"
            active={index === 1}
            onClick={() => setIndex(1)}
          >
            {t('configuration.notes')}
          </CNavLink>
        </CNav>
        <CTabContent>
          <CTabPane active={index === 0} className="pt-2">
            {index === 0 ? (
              <EditInventoryTagForm
                t={t}
                disable={loading}
                fields={fields}
                updateField={updateFieldWithId}
                updateFieldDirectly={updateField}
                deviceTypes={deviceTypes}
                entities={entities}
                venues={venues}
                editing={editing}
                batchSetField={batchSetField}
              />
            ) : null}
          </CTabPane>
          <CTabPane active={index === 1}>
            {index === 1 ? (
              <DetailedNotesTable
                t={t}
                notes={fields.notes.value}
                addNote={addNote}
                loading={loading}
                editable={editing}
              />
            ) : null}
          </CTabPane>
        </CTabContent>
      </CModalBody>
    </CModal>
  );
};

EditTagModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refreshTable: PropTypes.func,
  tagSerialNumber: PropTypes.string,
  pushConfig: PropTypes.func.isRequired,
};

EditTagModal.defaultProps = {
  tagSerialNumber: null,
  refreshTable: null,
};

export default EditTagModal;
