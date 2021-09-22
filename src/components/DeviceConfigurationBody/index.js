import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CButton } from '@coreui/react';
import { useFormFields, useAuth, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { BASE_FORM, GLOBALS_FORM } from './constants';
import Globals from './components/Globals';
import Base from './components/Base';

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

  const [baseFields, updateBaseWithId, , setBaseFields] = useFormFields(BASE_FORM);

  // Information related to the globals part of the configuration
  const [globalActive, setGlobalActive] = useState(false);
  const [globalFields, updateGlobalWithId, updateGlobal, setGlobalFields] =
    useFormFields(GLOBALS_FORM);

  const save = () => {
    // Creating our new config object
    const newConfig = { configuration: {} };

    // Mapping general info
    for (const [key, field] of Object.entries(baseFields)) {
      newConfig[key] = field.value;
    }

    // Mapping globals
    if (globalActive) {
      newConfig.configuration = { globals: {} };

      for (const [key, field] of Object.entries(globalFields)) {
        newConfig.configuration.globals[key] = field.value;
      }
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
        const globals = { ...GLOBALS_FORM };
        for (const [key, field] of Object.entries(config.configuration.globals)) {
          if (globals[key] !== undefined) {
            globals[key] = { ...globals[key], value: field };
          }
        }
        setGlobalActive(true);
        setGlobalFields(globals);
      } else {
        setGlobalActive(false);
        setGlobalFields(GLOBALS_FORM);
      }
    } else {
      if (config === null && sectionToCreate !== null)
        setBaseFields({
          ...BASE_FORM,
          name: {
            type: 'string',
            value: `${sectionToCreate.charAt(0).toUpperCase()}${sectionToCreate.slice(1)}`,
            error: false,
            required: true,
          },
        });
      else setBaseFields(BASE_FORM);
      setGlobalActive(false);
      setGlobalFields(GLOBALS_FORM);
    }
  }, [config, sectionToCreate]);

  useEffect(() => {}, [sectionToCreate]);

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
        refresh={refresh}
      />
      <Globals
        isActive={globalActive}
        setActive={setGlobalActive}
        fields={globalFields}
        updateWithId={updateGlobalWithId}
        updateField={updateGlobal}
        setFields={setGlobalFields}
      />
      <pre>{JSON.stringify(config, null, '\t')}</pre>
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
