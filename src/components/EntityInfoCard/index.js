import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CButtonToolbar, CCard, CCardBody, CCardHeader, CPopover } from '@coreui/react';
import { cilPencil, cilSave, cilSync, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  EditEntityForm,
  useAuth,
  useEntity,
  useFormFields,
  useToast,
  useToggle,
} from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import DeleteEntityModal from 'components/DeleteEntityModal';
import AssociateConfigurationModal from 'components/AssociateConfigurationModal';
import EntityIpModal from 'components/EntityIpModal';

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
      <CCardHeader className="p-1">
        <div className="text-value-lg float-left">
          {t('entity.entity')}: {entity?.name}
        </div>
        <div className="text-right float-right">
          <CButtonToolbar role="group" className="justify-content-end">
            <CPopover content={t('common.save')}>
              <CButton
                disabled={!editing}
                color="primary"
                variant="outline"
                onClick={editEntity}
                className="mx-1"
              >
                <CIcon name="cil-save" content={cilSave} />
              </CButton>
            </CPopover>
            {'  '}
            <CPopover content={t('common.edit')}>
              <CButton
                disabled={editing}
                color="primary"
                variant="outline"
                onClick={toggleEditing}
                className="mx-1"
              >
                <CIcon name="cil-pencil" content={cilPencil} />
              </CButton>
            </CPopover>
            {'  '}
            <CPopover content={t('common.stop_editing')}>
              <CButton
                disabled={!editing}
                color="primary"
                variant="outline"
                onClick={toggleEditing}
                className="mx-1"
              >
                <CIcon name="cil-x" content={cilX} />
              </CButton>
            </CPopover>
            {'  '}
            <CPopover content={t('common.delete')}>
              <CButton
                disabled={editing}
                color="primary"
                variant="outline"
                onClick={toggleDelete}
                className="mx-1"
              >
                <CIcon name="cil-trash" content={cilTrash} />
              </CButton>
            </CPopover>
            {'  '}
            <CPopover content={t('common.refresh')}>
              <CButton
                disabled={editing}
                color="primary"
                variant="outline"
                onClick={refreshPage}
                className="mx-1"
              >
                <CIcon content={cilSync} />
              </CButton>
            </CPopover>
          </CButtonToolbar>
        </div>
      </CCardHeader>
      <CCardBody className="py-1">
        <EditEntityForm
          t={t}
          disable={loading}
          fields={fields}
          updateField={updateFieldWithId}
          updateFieldDirectly={updateField}
          addNote={addNote}
          editing={editing}
          toggleAssociate={toggleAssociate}
          toggleIpModal={toggleIp}
        />
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
    </CCard>
  );
};

EntityInfoCard.propTypes = {
  refreshPage: PropTypes.func.isRequired,
};

export default EntityInfoCard;
