import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CButton, CButtonToolbar, CCard, CCardBody, CCardHeader, CPopover } from '@coreui/react';
import { cilPencil, cilSave, cilSync, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { EditEntityForm, useAuth, useEntity, useFormFields, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import DeleteEntityModal from 'components/DeleteEntityModal';
import AssociateConfigurationModal from 'components/AssociateConfigurationModal';

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
    value: '',
    error: false,
  },
  deviceConfiguration: {
    value: '',
    uuid: '',
    error: false,
  },
  notes: {
    value: [],
    error: false,
  },
};

const EntityInfoCard = () => {
  const { t } = useTranslation();
  const { entity, setEntity, refreshEntity } = useEntity();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAssociate, setShowAssociate] = useState(false);

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

  const getEntityInfo = () => {
    setLoading(true);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity/${entity.uuid}`, options)
      .then((response) => {
        const newFields = fields;
        for (const [key] of Object.entries(newFields)) {
          if (response.data[key] !== undefined) {
            if (key !== 'deviceConfiguration') newFields[key].value = response.data[key];
            else newFields.deviceConfiguration = { value: '', uuid: response.data[key] };
          }
        }
        setFormFields({ ...newFields });

        if (response.data.deviceConfiguration !== '') {
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
        addToast({
          title: t('common.error'),
          body: t('entity.error_fetch_entity'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleEditing = () => {
    if (editing) {
      getEntityInfo();
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

      const parameters = {
        uuid: entity.uuid,
        name: fields.name.value,
        description: fields.description.value,
        rrm: fields.rrm.value,
        deviceConfiguration: fields.deviceConfiguration.value,
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/entity/${entity.uuid}`, parameters, options)
        .then(() => {
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
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        uuid: entity.uuid,
        deviceConfiguration: v.uuid,
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/entity/${entity.uuid}`, parameters, options)
        .then(() => {
          toggleAssociate();

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

  const addNote = (newNote) => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {
      uuid: entity.uuid,
      notes: [{ note: newNote }],
    };

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/entity/${entity.uuid}`, parameters, options)
      .then(() => {
        getEntityInfo();
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('common.error_adding_note'),
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
    if (entity !== null) {
      setEditing(false);
      getEntityInfo();
    }
  }, [entity]);

  return (
    <CCard>
      <CCardHeader className="p-1">
        <div className="text-value-lg float-left">{entity?.name}</div>
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
                onClick={getEntityInfo}
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
        />
      </CCardBody>
      <DeleteEntityModal show={showDelete} toggle={toggleDelete} />
      <AssociateConfigurationModal
        show={showAssociate}
        toggle={toggleAssociate}
        defaultConfig={fields.deviceConfiguration}
        updateConfiguration={updateConfiguration}
      />
    </CCard>
  );
};

export default EntityInfoCard;
