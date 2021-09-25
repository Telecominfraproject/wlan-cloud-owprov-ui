import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CButton } from '@coreui/react';
import { useFormFields, useAuth, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { BASE_FORM, GLOBALS_FORM, METRICS_FORM, SERVICES_FORM, UNIT_FORM } from './constants';
import Globals from './components/Globals';
import Base from './components/Base';
import Unit from './components/Unit';
import Metrics from './components/Metrics';
import Radios from './components/Radios';
import Interfaces from './components/Interfaces';
import Services from './components/Services';

const DeviceConfigurationBody = ({
  parentConfiguration,
  config,
  setNewBlock,
  index,
  sectionToCreate,
  refresh,
  toggleSectionChoice,
}) => {
  const { t } = useTranslation();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [activeSection, setActiveSection] = useState('');
  const [canSave, setCanSave] = useState(false);

  const [baseFields, updateBaseWithId, , setBaseFields] = useFormFields(BASE_FORM);

  // Section's form
  const [fields, updateWithId, updateField, setFields] = useFormFields({});

  // Parsing blocks into valid json config
  const parseBlock = () => {
    // Creating our new config object
    const newConfig = { configuration: {} };

    // Mapping general info
    for (const [key, field] of Object.entries(baseFields)) {
      newConfig[key] = field.value;
    }

    // Mapping globals
    if (activeSection === 'globals') {
      newConfig.configuration = { globals: {} };

      for (const [key, field] of Object.entries(fields)) {
        newConfig.configuration.globals[key] = field.value;
      }
    }
    // Mapping unit
    else if (activeSection === 'unit') {
      newConfig.configuration = { unit: {} };

      for (const [key, field] of Object.entries(fields)) {
        newConfig.configuration.unit[key] = field.value;
      }
    }
    // Mapping metrics
    else if (activeSection === 'metrics') {
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
    // Mapping services
    else if (activeSection === 'services') {
      newConfig.configuration = { services: {} };

      for (const [key, field] of Object.entries(fields)) {
        if (field.enabled) {
          newConfig.configuration.services[key] = {};
          for (const [subKey, subField] of Object.entries(field)) {
            newConfig.configuration.services[key][subKey] = subField.value;
          }
        }
      }
    }
    // Mapping radios
    else if (activeSection === 'radios') {
      newConfig.configuration = { radios: fields.radios };
    }
    // Mapping interfaces
    else if (activeSection === 'interfaces') {
      newConfig.configuration = { interfaces: fields.interfaces };
    }

    newConfig.configuration = JSON.stringify(newConfig.configuration);

    return newConfig;
  };

  const save = () => {
    // Creating our new config object
    const newConfig = parseBlock();

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

  const onEdit = () => {
    const newBlock = parseBlock();
    if (newBlock.configuration) setNewBlock(newBlock.configuration);
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
    newBlocks.splice(index, 1);
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
      const newActiveSection = Object.keys(config.configuration)[0];

      // Mapping general info
      const base = { ...BASE_FORM };
      for (const [key, field] of Object.entries(config)) {
        if (base[key] !== undefined) {
          base[key] = { ...base[key], value: field };
        }
      }
      setBaseFields(base);

      // Mapping globals
      if (newActiveSection === 'globals') {
        const form = { ...GLOBALS_FORM };
        for (const [key, field] of Object.entries(config.configuration.globals)) {
          if (form[key] !== undefined) {
            form[key] = { ...form[key], value: field };
          }
        }
        setFields(form);
      }
      // Mapping unit
      else if (newActiveSection === 'unit') {
        const form = { ...UNIT_FORM };
        for (const [key, field] of Object.entries(config.configuration.unit)) {
          if (form[key] !== undefined) {
            form[key] = { ...form[key], value: field };
          }
        }
        setFields(form);
      }
      // Mapping metrics
      else if (newActiveSection === 'metrics') {
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
      // Mapping services
      else if (newActiveSection === 'services') {
        const form = { ...SERVICES_FORM };
        for (const [key] of Object.entries(config.configuration.services)) {
          if (form[key] !== undefined) {
            // Services section contains nested parts, so we need to loop within those and enable them in our form
            form[key] = { ...form[key], enabled: true };
            for (const [subKey, subField] of Object.entries(config.configuration.services[key])) {
              if (form[key][subKey] !== undefined) {
                form[key][subKey] = { ...form[key][subKey], value: subField };
              }
            }
          }
        }
        setFields(form);
      }
      // Mapping radios
      else if (newActiveSection === 'radios') {
        const newFields = {
          radios: config.configuration.radios,
        };

        setFields(newFields);
      }
      // Mapping interfaces
      else if (newActiveSection === 'interfaces') {
        const newFields = {
          interfaces: config.configuration.interfaces,
        };

        setFields(newFields);
      }

      // Showing to the user the sections that we should show based on the config
      setActiveSection(newActiveSection);
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
      switch (sectionToCreate) {
        case 'globals':
          setCanSave(true);
          setFields(GLOBALS_FORM);
          setActiveSection('globals');
          break;
        case 'unit':
          setCanSave(true);
          setFields(UNIT_FORM);
          setActiveSection('unit');
          break;
        case 'metrics':
          setCanSave(true);
          setFields(METRICS_FORM);
          setActiveSection('metrics');
          break;
        case 'services':
          setCanSave(true);
          setFields(SERVICES_FORM);
          setActiveSection('services');
          break;
        case 'radios':
          setCanSave(false);
          setActiveSection('radios');
          break;
        case 'interfaces':
          setCanSave(false);
          setActiveSection('interfaces');
          break;
        default:
          break;
      }
    }
  }, [config, sectionToCreate]);

  useEffect(() => {
    onEdit();
  }, [fields]);

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
      {activeSection === 'globals' && (
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
          <Globals
            fields={fields}
            updateWithId={updateWithId}
            updateField={updateField}
            setFields={setFields}
          />
        </div>
      )}
      {activeSection === 'unit' && (
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
          <Unit
            fields={fields}
            updateWithId={updateWithId}
            updateField={updateField}
            setFields={setFields}
          />
        </div>
      )}
      {activeSection === 'metrics' && (
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
          <Metrics
            fields={fields}
            updateWithId={updateWithId}
            updateField={updateField}
            setFields={setFields}
          />
        </div>
      )}
      {activeSection === 'radios' && (
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
          <Radios
            fields={fields}
            creating={config === null}
            updateWithId={updateWithId}
            updateField={updateField}
            setFields={setFields}
            setCanSave={setCanSave}
          />
        </div>
      )}
      {activeSection === 'interfaces' && (
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
          <Interfaces
            fields={fields}
            creating={config === null}
            updateWithId={updateWithId}
            updateField={updateField}
            setFields={setFields}
            setCanSave={setCanSave}
          />
        </div>
      )}
      {activeSection === 'services' && (
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
          <Services
            fields={fields}
            creating={config === null}
            updateWithId={updateWithId}
            updateField={updateField}
            setFields={setFields}
            setCanSave={setCanSave}
          />
        </div>
      )}
    </div>
  );
};

DeviceConfigurationBody.propTypes = {
  parentConfiguration: PropTypes.instanceOf(Object).isRequired,
  config: PropTypes.instanceOf(Object),
  setNewBlock: PropTypes.func.isRequired,
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
