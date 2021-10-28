import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CButtonToolbar, CButton, CPopover, CCard, CCardHeader, CCardBody } from '@coreui/react';
import { cilPencil, cilSave, cilSync, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useAuth, useToast, useFormFields, EditConfigurationForm, useEntity } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import axiosInstance from 'utils/axiosInstance';
import ConfigurationInUseModal from 'components/ConfigurationInUseModal';
import DeleteConfigurationModal from 'components/DeleteConfigurationModal';

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
  notes: {
    value: [],
    error: false,
  },
  inUse: {
    value: [],
    error: false,
  },
  deviceTypes: {
    value: [],
    error: false,
    notEmpty: true,
  },
  rrm: {
    value: 'inherit',
    error: false,
    required: true,
  },
  firmwareUpgrade: {
    value: 'inherit',
    error: false,
  },
  firmwareRCOnly: {
    value: false,
    error: false,
  },
};

const ConfigurationDetails = ({ configId, config, setConfig }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentToken, endpoints } = useAuth();
  const { deviceTypes } = useEntity();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showInUse, setShowInUse] = useState(false);

  const toggleDelete = () => setShowDelete(!showDelete);

  const parseInUse = (inUse) => {
    let entities = 0;
    let venues = 0;
    let devices = 0;

    for (let i = 0; i < inUse.length; i += 1) {
      const type = inUse[i].substring(0, 3);
      if (type === 'ent') entities += 1;
      else if (type === 'ven') venues += 1;
      else if (type === 'inv') devices += 1;
    }

    return t('configuration.used_by_details', { entities, venues, devices });
  };

  const toggleInUse = () => setShowInUse(!showInUse);

  const validation = () => {
    let success = true;

    for (const [key, field] of Object.entries(fields)) {
      if (field.required && field.value === '') {
        updateField(key, { error: true });
        success = false;
        break;
      }
      if (field.notEmpty && field.value.length === 0) {
        updateField(key, { error: true, notEmpty: true });
        success = false;
        break;
      }
    }

    return success;
  };

  const getConfig = () => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/configurations/${configId}`, options)
      .then((response) => {
        // Mapping fields for edit form
        const newFields = fields;
        for (const [key] of Object.entries(newFields)) {
          if (response.data[key] !== undefined) {
            if (key === 'firmwareUpgrade' && response.data[key] === '') break;
            newFields[key].value = response.data[key];
          }
        }
        setFormFields({ ...newFields });

        // Parsing the nested configurations array into JSON objects
        const configurations = response.data.configuration.map((conf) => ({
          ...conf,
          configuration: JSON.parse(conf.configuration),
        }));
        const newConfig = response.data;
        newConfig.configuration = configurations;

        setConfig({ ...newConfig, parsedInUse: parseInUse(newConfig.inUse) });
      })
      .catch(() => {
        setConfig(null);
        addToast({
          title: t('common.error'),
          body: t('configuration.error_fetching_config'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const toggleEditing = () => {
    if (editing) getConfig();
    setEditing(!editing);
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

  const saveConfig = () => {
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
        id: configId,
        name: fields.name.value,
        description: fields.description.value,
        deviceTypes: fields.deviceTypes.value,
        rrm: fields.rrm.value,
        notes: newNotes,
        firmwareUpgrade: fields.firmwareUpgrade.value,
        firmwareRCOnly:
          fields.firmwareUpgrade.value === 'no' ? undefined : fields.firmwareRCOnly.value,
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/configurations/${configId}`, parameters, options)
        .then(() => {
          getConfig();
          addToast({
            title: t('common.success'),
            body: t('common.saved'),
            color: 'success',
            autohide: true,
          });
          setEditing(false);
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('entity.save_failure', { error: e.response?.data?.ErrorDescription }),
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
    if (configId && configId !== '') getConfig();
  }, [configId]);

  return (
    <CCard>
      <CCardHeader className="dark-header">
        <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
          {t('configuration.title')}: {config?.name}
        </div>
        <div className="float-right">
          <CButtonToolbar role="group" className="justify-content-end">
            <CPopover content={t('common.save')}>
              <CButton disabled={!editing} color="info" onClick={saveConfig}>
                <CIcon name="cil-save" content={cilSave} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.edit')}>
              <CButton disabled={editing} color="dark" onClick={toggleEditing} className="ml-2">
                <CIcon name="cil-pencil" content={cilPencil} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.stop_editing')}>
              <CButton disabled={!editing} color="dark" onClick={toggleEditing} className="ml-2">
                <CIcon name="cil-x" content={cilX} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.delete')}>
              <CButton
                disabled={editing || config?.inUse?.length > 0}
                color="info"
                onClick={toggleDelete}
                className="ml-2"
              >
                <CIcon name="cil-trash" content={cilTrash} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.refresh')}>
              <CButton disabled={editing} color="info" onClick={getConfig} className="ml-2">
                <CIcon content={cilSync} />
              </CButton>
            </CPopover>
          </CButtonToolbar>
        </div>
      </CCardHeader>
      <CCardBody className="py-0">
        <EditConfigurationForm
          t={t}
          disable={loading}
          fields={fields}
          updateField={updateFieldWithId}
          updateFieldWithKey={updateField}
          addNote={addNote}
          editing={editing}
          toggleInUseModal={toggleInUse}
          deviceTypes={deviceTypes}
          config={config}
        />
      </CCardBody>
      <ConfigurationInUseModal show={showInUse} toggle={toggleInUse} config={config} />
      <DeleteConfigurationModal show={showDelete} toggle={toggleDelete} config={config} />
    </CCard>
  );
};

ConfigurationDetails.propTypes = {
  configId: PropTypes.string.isRequired,
  config: PropTypes.instanceOf(Object),
  setConfig: PropTypes.func.isRequired,
};

ConfigurationDetails.defaultProps = {
  config: null,
};

export default ConfigurationDetails;
