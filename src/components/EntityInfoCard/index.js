import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  CButton,
  CButtonToolbar,
  CCard,
  CCardBody,
  CCardHeader,
  CPopover,
  CNav,
  CNavLink,
  CTabPane,
  CTabContent,
} from '@coreui/react';
import { cilPencil, cilPlus, cilSave, cilSync, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  useAuth,
  useEntity,
  useFormFields,
  useToast,
  useToggle,
  DetailedNotesTable,
} from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import DeleteEntityModal from 'components/DeleteEntityModal';
import AssociateConfigurationModal from 'components/AssociateConfigurationModal';
import EntityIpModal from 'components/EntityIpModal';
import AddEntityModal from 'components/AddEntityModal';
import EditEntityForm from './Form';

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
  created: {
    value: '',
    error: false,
  },
  modified: {
    value: '',
    error: false,
  },
  rrm: {
    value: 'inherit',
    error: false,
  },
  deviceConfiguration: {
    value: [],
    error: false,
  },
  notes: {
    value: [],
    error: false,
  },
  sourceIP: {
    value: [],
    error: false,
  },
};

const EntityInfoCard = ({ refreshPage }) => {
  const { t } = useTranslation();
  const { entity, setEntity, refreshEntity } = useEntity();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAssociate, setShowAssociate] = useState(false);
  const [showIp, toggleIp] = useToggle(false);
  const [showAddEntity, toggleShowAddEntity] = useToggle(false);
  const [index, setIndex] = useState(0);

  const toggleAssociate = () => setShowAssociate(!showAssociate);

  const toggleDelete = () => setShowDelete(!showDelete);

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

  const parseEntity = () => {
    setLoading(true);

    const newFields = { ...initialForm };

    for (const [key] of Object.entries(newFields)) {
      if (entity.extraData[key] !== undefined) {
        if (key === 'deviceConfiguration')
          newFields.deviceConfiguration = { value: entity.extraData[key].map((id) => ({ id })) };
        else if (key === 'rrm')
          newFields[key].value = entity.extraData[key] === '' ? 'inherit' : entity.extraData[key];
        else newFields[key].value = entity.extraData[key];
      }
    }

    if (entity.extraData.deviceConfiguration.length > 0) {
      newFields.deviceConfiguration.value = entity.extraData.extendedInfo.deviceConfiguration;
    }

    setFormFields({ ...newFields }, true);

    setLoading(false);
  };

  const toggleEditing = () => {
    if (editing) {
      refreshPage();
    }
    setEditing(!editing);
  };

  const editEntity = () => {
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const newNotes = [];

      for (let i = 0; i < fields.notes.value.length; i += 1) {
        if (fields.notes.value[i].new) newNotes.push({ note: fields.notes.value[i].note });
      }

      const parameters = {
        uuid: entity.uuid,
        name: fields.name.value,
        description: fields.description.value,
        rrm: fields.rrm.value,
        sourceIP: fields.sourceIP.value,
        notes: newNotes,
        deviceConfiguration: fields.deviceConfiguration.value.map((c) => c.id),
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/entity/${entity.uuid}`, parameters, options)
        .then(() => {
          refreshPage();
          refreshEntity(entity.path, {
            name: fields.name.value,
          });

          setEntity({
            ...entity,
            ...{
              name: fields.name.value,
            },
          });

          addToast({
            title: t('common.success'),
            body: t('common.saved'),
            color: 'success',
            autohide: true,
          });
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('entity.error_saving'),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const updateConfiguration = (v) => {
    updateField('deviceConfiguration', { value: v });
    toggleAssociate();
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
    if (entity !== null && Object.keys(entity.extraData).length > 0) {
      setEditing(false);
      parseEntity();
    }
  }, [entity]);

  return (
    <CCard>
      <CCardHeader className="dark-header">
        <div className="text-value-lg float-left">
          {t('entity.entity')}: {entity?.name}
        </div>
        <div className="text-right float-right">
          <CButtonToolbar role="group" className="justify-content-end">
            <CPopover content={t('entity.add_child', { entityName: entity?.name })}>
              <CButton color="success" onClick={toggleShowAddEntity}>
                <CIcon content={cilPlus} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.save')}>
              <CButton disabled={!editing} color="info" onClick={editEntity} className="ml-2">
                <CIcon content={cilSave} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.edit')}>
              <CButton disabled={editing} color="dark" onClick={toggleEditing} className="ml-2">
                <CIcon content={cilPencil} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.stop_editing')}>
              <CButton disabled={!editing} color="dark" onClick={toggleEditing} className="ml-2">
                <CIcon content={cilX} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.delete')}>
              <CButton disabled={editing} color="danger" onClick={toggleDelete} className="ml-2">
                <CIcon content={cilTrash} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.refresh')}>
              <CButton disabled={editing} color="info" onClick={refreshPage} className="ml-2">
                <CIcon content={cilSync} />
              </CButton>
            </CPopover>
          </CButtonToolbar>
        </div>
      </CCardHeader>
      <CCardBody className="py-1">
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
              <EditEntityForm
                t={t}
                disable={loading}
                fields={fields}
                updateField={updateFieldWithId}
                updateFieldDirectly={updateField}
                editing={editing}
                toggleAssociate={toggleAssociate}
                toggleIpModal={toggleIp}
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
      </CCardBody>
      <DeleteEntityModal show={showDelete} toggle={toggleDelete} />
      <AssociateConfigurationModal
        show={showAssociate}
        toggle={toggleAssociate}
        defaultConfigs={fields.deviceConfiguration.value}
        updateConfiguration={updateConfiguration}
      />
      <EntityIpModal
        show={showIp}
        toggle={toggleIp}
        ips={fields.sourceIP.value}
        updateField={updateField}
      />
      <AddEntityModal show={showAddEntity} toggle={toggleShowAddEntity} />
    </CCard>
  );
};

EntityInfoCard.propTypes = {
  refreshPage: PropTypes.func.isRequired,
};

export default EntityInfoCard;
