import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CButton } from '@coreui/react';
import { useFormFields, useAuth, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { BASE_FORM, GLOBALS_FORM, METRICS_FORM, UNIT_FORM } from './constants';
import Globals from './components/Globals';
import Base from './components/Base';
import Unit from './components/Unit';
import Metrics from './components/Metrics';
import Radios from './components/Radios';
import Interfaces from './components/Interfaces';

const initialSections = {
  base: true,
  globals: false,
  unit: false,
  service: false,
  metrics: false,
  radios: false,
  interfaces: false,
};

const DeviceConfigurationBody = ({
  parentConfiguration,
  config,
  index,
  sectionToCreate,
  refresh,
  toggleSectionChoice,
}) => {
  const { t } = useTranslation();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [activeSections, setActiveSections] = useState(initialSections);
  const [canSave, setCanSave] = useState(false);

  const [baseFields, updateBaseWithId, , setBaseFields] = useFormFields(BASE_FORM);

  // Section's form
  const [fields, updateWithId, updateField, setFields] = useFormFields({});

  const save = () => {
    // Creating our new config object
    const newConfig = { configuration: {} };

    // Mapping general info
    for (const [key, field] of Object.entries(baseFields)) {
      newConfig[key] = field.value;
    }

    // Mapping globals
    if (activeSections.globals) {
      newConfig.configuration = { globals: {} };

      for (const [key, field] of Object.entries(fields)) {
        newConfig.configuration.globals[key] = field.value;
      }
    }

    // Mapping unit
    if (activeSections.unit) {
      newConfig.configuration = { unit: {} };

      for (const [key, field] of Object.entries(fields)) {
        newConfig.configuration.unit[key] = field.value;
      }
    }

    // Mapping metrics
    if (activeSections.metrics) {
      newConfig.configuration = { metrics: {} };

      for (const [key, field] of Object.entries(fields)) {
        if (field.enabled) {
          newConfig.configuration.metrics[key] = {};
          for (const [subKey, subField] of Object.entries(field)) {
            newConfig.configuration.metrics[key][subKey] = subField.value;
          }
        }
      }
    }

    // Mapping radios
    if (activeSections.radios) {
      newConfig.configuration = { radios: fields.radios };
    }

    // Mapping interfaces
    if (activeSections.interfaces) {
      newConfig.configuration = { interfaces: fields.interfaces };
    }

    newConfig.configuration = JSON.stringify(newConfig.configuration);

    const newArray = parentConfiguration.configuration;
    if (index >= 0) newArray[index] = newConfig;
    else newArray.push(newConfig);

    const newFullConfiguration = parentConfiguration;
    newFullConfiguration.configuration = newArray;

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = newFullConfiguration;

    axiosInstance
      .put(
        `${endpoints.owprov}/api/v1/configurations/${parentConfiguration.id}`,
        parameters,
        options,
      )
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('configuration.success_update'),
          color: 'success',
          autohide: true,
        });
        refresh();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('configuration.error_update', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      });
  };

  const deleteConfigBlock = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const newFullConfiguration = parentConfiguration;
    const newBlocks = newFullConfiguration.configuration;
    newBlocks.splice(index);
    newFullConfiguration.configuration = newBlocks;
    const parameters = newFullConfiguration;

    axiosInstance
      .put(
        `${endpoints.owprov}/api/v1/configurations/${parentConfiguration.id}`,
        parameters,
        options,
      )
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('configuration.success_block_delete'),
          color: 'success',
          autohide: true,
        });
        refresh();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('configuration.error_update', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      });
  };

  useEffect(() => {
    // Adding fields already defined in API to the UI
    if (config !== null) {
      setCanSave(true);
      const sections = { ...initialSections };

      for (const [sec] of Object.entries(config.configuration)) {
        if (activeSections[sec] !== undefined) sections[sec] = true;
      }

      // Mapping general info
      const base = { ...BASE_FORM };
      for (const [key, field] of Object.entries(config)) {
        if (base[key] !== undefined) {
          base[key] = { ...base[key], value: field };
        }
      }
      setBaseFields(base);

      // Mapping globals
      if (config.configuration.globals !== undefined) {
        const form = { ...GLOBALS_FORM };
        for (const [key, field] of Object.entries(config.configuration.globals)) {
          if (form[key] !== undefined) {
            form[key] = { ...form[key], value: field };
          }
        }
        setFields(form);
      }

      // Mapping unit
      if (config.configuration.unit !== undefined) {
        const form = { ...UNIT_FORM };
        for (const [key, field] of Object.entries(config.configuration.unit)) {
          if (form[key] !== undefined) {
            form[key] = { ...form[key], value: field };
          }
        }
        setFields(form);
      }

      // Mapping metrics
      if (config.configuration.metrics !== undefined) {
        const form = { ...METRICS_FORM };
        for (const [key] of Object.entries(config.configuration.metrics)) {
          if (form[key] !== undefined) {
            // Metrics section contains nested parts, so we need to loop within those and enable them in our form
            form[key] = { ...form[key], enabled: true };
            for (const [subKey, subField] of Object.entries(config.configuration.metrics[key])) {
              if (form[key][subKey] !== undefined) {
                form[key][subKey] = { ...form[key][subKey], value: subField };
              }
            }
          }
        }
        setFields(form);
      }

      // Mapping radios
      if (config.configuration.radios !== undefined) {
        const newFields = {
          radios: config.configuration.radios,
        };

        setFields(newFields);
      }

      // Mapping interfaces
      if (config.configuration.interfaces !== undefined) {
        const newFields = {
          interfaces: config.configuration.interfaces,
        };

        setFields(newFields);
      }

      // Showing to the user the sections that we should show based on the config
      setActiveSections(sections);
    }

    // If we are creating a config and already know which section to show it
    else if (sectionToCreate !== null) {
      setBaseFields({
        ...BASE_FORM,
        name: {
          type: 'string',
          value: `${sectionToCreate.charAt(0).toUpperCase()}${sectionToCreate.slice(1)}`,
          error: false,
          required: true,
        },
      });

      const newSections = { ...initialSections };

      switch (sectionToCreate) {
        case 'globals':
          setCanSave(true);
          setFields(GLOBALS_FORM);
          newSections.globals = true;
          break;
        case 'unit':
          setCanSave(true);
          setFields(UNIT_FORM);
          newSections.unit = true;
          break;
        case 'metrics':
          setCanSave(true);
          setFields(METRICS_FORM);
          newSections.metrics = true;
          break;
        case 'radios':
          setCanSave(false);
          newSections.radios = true;
          break;
        case 'interfaces':
          setCanSave(false);
          newSections.interfaces = true;
          break;
        default:
          break;
      }
      setActiveSections({ ...newSections });
    }
  }, [config, sectionToCreate]);

  if (config === null && sectionToCreate === null) {
    return (
      <div className="text-center">
        <CButton onClick={toggleSectionChoice} color="primary">
          Choose Section to Create
        </CButton>
      </div>
    );
  }

  return (
    <div>
      <Base
        save={save}
        deleteConfig={deleteConfigBlock}
        creating={config === null}
        fields={baseFields}
        updateWithId={updateBaseWithId}
        canSave={canSave}
        refresh={refresh}
      />
      {activeSections.globals && (
        <Globals
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
        />
      )}
      {activeSections.unit && (
        <Unit
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
        />
      )}
      {activeSections.metrics && (
        <Metrics
          fields={fields}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
        />
      )}
      {activeSections.radios && (
        <Radios
          fields={fields}
          creating={config === null}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
          setCanSave={setCanSave}
        />
      )}
      {activeSections.interfaces && (
        <Interfaces
          fields={fields}
          creating={config === null}
          updateWithId={updateWithId}
          updateField={updateField}
          setFields={setFields}
          setCanSave={setCanSave}
        />
      )}
    </div>
  );
};

DeviceConfigurationBody.propTypes = {
  parentConfiguration: PropTypes.instanceOf(Object).isRequired,
  config: PropTypes.instanceOf(Object),
  index: PropTypes.number.isRequired,
  sectionToCreate: PropTypes.string,
  refresh: PropTypes.func.isRequired,
  toggleSectionChoice: PropTypes.func.isRequired,
};

DeviceConfigurationBody.defaultProps = {
  sectionToCreate: null,
  config: null,
};

export default DeviceConfigurationBody;
