import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTabPane,
  CTabContent,
  CNav,
  CNavLink,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPopover,
  CRow,
  CCol,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilX, cilSave, cilSync } from '@coreui/icons';
import { useAuth, useToast, useFormFields } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import DeviceConfigurationBody from 'components/DeviceConfigurationBody';
import {
  BASE_FORM,
  GLOBALS_FORM,
  METRICS_FORM,
  SERVICES_FORM,
  UNIT_FORM,
} from '../DeviceConfigurationBody/constants';
import RawJsonConfig from './RawJsonConfig';

const blocksObj = {
  unit: {},
  globals: {},
  metrics: {},
  services: {},
  radios: {},
  interfaces: {},
};

const createNewSection = (newSection) => {
  const base = {
    ...BASE_FORM,
    name: {
      type: 'string',
      value: `${newSection.charAt(0).toUpperCase()}${newSection.slice(1)}`,
      error: false,
      required: true,
    },
  };

  let newFields = {};

  switch (newSection) {
    case 'globals':
      newFields = GLOBALS_FORM;
      break;
    case 'unit':
      newFields = UNIT_FORM;
      break;
    case 'metrics':
      newFields = METRICS_FORM;
      break;
    case 'services':
      newFields = SERVICES_FORM;
      break;
    case 'interfaces':
      newFields = { interfaces: [] };
      break;
    case 'radios':
      newFields = { radios: [] };
      break;
    default:
      break;
  }

  return {
    base,
    newFields,
  };
};

// Parsing blocks into valid json config
const parseBlock = (activeSection, baseFields, fields) => {
  // Creating our new config object
  const newConfig = { configuration: {} };

  // Mapping general info
  for (const [k, field] of Object.entries(baseFields)) {
    newConfig[k] = field.value;
  }

  // Mapping globals
  if (activeSection === 'globals') {
    newConfig.configuration = { globals: {} };

    for (const [k, field] of Object.entries(fields)) {
      newConfig.configuration.globals[k] = field.value;
    }
  }
  // Mapping unit
  else if (activeSection === 'unit') {
    newConfig.configuration = { unit: {} };

    for (const [k, field] of Object.entries(fields)) {
      newConfig.configuration.unit[k] = field.value;
    }
  }
  // Mapping metrics
  else if (activeSection === 'metrics') {
    newConfig.configuration = { metrics: {} };

    for (const [k, field] of Object.entries(fields)) {
      if (field.enabled) {
        newConfig.configuration.metrics[k] = {};
        for (const [subKey, subField] of Object.entries(field)) {
          newConfig.configuration.metrics[k][subKey] = subField.value;
        }
      }
    }
  }
  // Mapping services
  else if (activeSection === 'services') {
    newConfig.configuration = { services: {} };

    for (const [k, field] of Object.entries(fields)) {
      if (field.enabled) {
        newConfig.configuration.services[k] = {};
        for (const [subKey, subField] of Object.entries(field)) {
          newConfig.configuration.services[k][subKey] = subField.value;
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

const ConfigurationExplorer = ({ config }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [show, setShow] = useState(false);
  const [configurations, setConfigurations] = useState([]);
  const [orderedBlocks, setOrderedBlocks] = useState(blocksObj);
  const [existingSections, setExistingSections] = useState([]);
  const [key, setKey] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [canSave, setCanSave] = useState(false);

  const [baseFields, updateBaseWithId, , setBaseFields] = useFormFields(BASE_FORM);

  // Section's form
  const [fields, updateWithId, updateField, setFields] = useFormFields({});

  const toggle = () => setShow(!show);

  const parseConfig = (data) => {
    // Parsing the nested configurations array into JSON objects
    const createdSections = [];
    const newConfigObj = { ...blocksObj };
    const configs = data.configuration.map((conf) => {
      const section = JSON.parse(conf.configuration);

      for (const [sec] of Object.entries(section)) {
        createdSections.push(sec);
        if (newConfigObj[sec] !== undefined) newConfigObj[sec] = section;
      }
      return {
        ...conf,
        configuration: section,
      };
    });

    return {
      createdSections,
      newConfigObj,
      configs,
    };
  };

  const getConfig = () => {
    const newActive = activeSection;
    setActiveSection('');
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/configurations/${config.id}`, options)
      .then((response) => {
        const obj = parseConfig(response.data);

        setOrderedBlocks(obj.newConfigObj);
        setExistingSections(obj.createdSections);
        setConfigurations(obj.configs);
        if (key >= obj.configs.length) {
          setKey(0);
        }
        setActiveSection(newActive);
      })
      .catch(() => {
        setConfigurations([]);
        addToast({
          title: t('common.error'),
          body: t('configuration.error_fetching_config'),
          color: 'danger',
          autohide: true,
        });
      });
  };

  const refreshConfig = (newConfig, isNew = false) => {
    const obj = parseConfig(newConfig);

    setOrderedBlocks(obj.newConfigObj);
    setExistingSections(obj.createdSections);
    setConfigurations(obj.configs);
    if (key >= obj.configs.length) {
      if (obj.configs.length > 0) setKey(0);
    } else if (isNew) setKey(obj.configs.length - 1);
  };

  const save = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {
      configuration: configurations,
    };

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/configurations/${config.id}`, parameters, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('configuration.success_update'),
          color: 'success',
          autohide: true,
        });
        getConfig();
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

  const chooseNewSection = (e) => {
    const obj = createNewSection(e.target.id);

    // Creating our new config object
    const newConfig = parseBlock(e.target.id, obj.base, obj.newFields);

    const newArray = configurations.map((conf) => ({
      ...conf,
      configuration: JSON.stringify(conf.configuration),
    }));
    newArray.push(newConfig);

    const newFullConfiguration = config;
    newFullConfiguration.configuration = newArray;

    refreshConfig(newFullConfiguration, true);

    toggle();
  };

  useEffect(() => {
    if (config) getConfig();
  }, [config]);

  useEffect(() => {
    if (activeSection !== '') {
      const updatedSection = parseBlock(activeSection, baseFields, fields);
      const newArray = configurations.map((conf) => ({
        ...conf,
        configuration: JSON.stringify(conf.configuration),
      }));
      newArray[key] = updatedSection;
      const newFullConfiguration = config;
      newFullConfiguration.configuration = newArray;

      refreshConfig(newFullConfiguration);
    }
  }, [fields, baseFields]);

  useEffect(() => {
    if (configurations && configurations[key]?.configuration) {
      // Adding fields already defined in API to the UI
      setCanSave(true);
      const newActiveSection = Object.keys(configurations[key].configuration)[0];
      // Mapping general info
      const base = { ...BASE_FORM };
      for (const [k, field] of Object.entries(configurations[key])) {
        if (base[k] !== undefined) {
          base[k] = { ...base[k], value: field };
        }
      }
      setBaseFields(base);

      // Mapping globals
      if (newActiveSection === 'globals') {
        const form = { ...GLOBALS_FORM };
        for (const [k, field] of Object.entries(configurations[key].configuration.globals)) {
          if (form[k] !== undefined) {
            form[k] = { ...form[k], value: field };
          }
        }
        setFields(form);
      }
      // Mapping unit
      else if (newActiveSection === 'unit') {
        const form = { ...UNIT_FORM };
        for (const [k, field] of Object.entries(configurations[key].configuration.unit)) {
          if (form[k] !== undefined) {
            form[k] = { ...form[k], value: field };
          }
        }
        setFields(form);
      }
      // Mapping metrics
      else if (newActiveSection === 'metrics') {
        const form = { ...METRICS_FORM };
        for (const [k] of Object.entries(configurations[key].configuration.metrics)) {
          if (form[k] !== undefined) {
            // Metrics section contains nested parts, so we need to loop within those and enable them in our form
            form[k] = { ...form[k], enabled: true };
            for (const [subKey, subField] of Object.entries(
              configurations[key].configuration.metrics[k],
            )) {
              if (form[k][subKey] !== undefined) {
                form[k][subKey] = { ...form[k][subKey], value: subField };
              }
            }
          }
        }
        setFields(form);
      }
      // Mapping services
      else if (newActiveSection === 'services') {
        const form = { ...SERVICES_FORM };
        for (const [k] of Object.entries(configurations[key].configuration.services)) {
          if (form[k] !== undefined) {
            // Services section contains nested parts, so we need to loop within those and enable them in our form
            form[k] = { ...form[k], enabled: true };
            for (const [subKey, subField] of Object.entries(
              configurations[key].configuration.services[k],
            )) {
              if (form[k][subKey] !== undefined) {
                form[k][subKey] = { ...form[k][subKey], value: subField };
              }
            }
          }
        }
        setFields(form);
      }
      // Mapping radios
      else if (newActiveSection === 'radios') {
        const newFields = {
          radios: configurations[key].configuration.radios,
        };

        setFields(newFields);
      }
      // Mapping interfaces
      else if (newActiveSection === 'interfaces') {
        const newFields = {
          interfaces: configurations[key].configuration.interfaces,
        };

        setFields(newFields);
      }

      // Showing to the user the sections that we should show based on the config
      setActiveSection(newActiveSection);
    } else if (configurations.length === 0) setActiveSection('');
  }, [configurations, key]);

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader className="p-1">
            <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
              Configuration Sections
            </div>
            <div className="float-right">
              <CPopover content={t('common.save')}>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={save}
                  disabled={!canSave}
                  className="mx-1"
                >
                  <CIcon name="cil-save" content={cilSave} />
                </CButton>
              </CPopover>
              {'  '}
              <CPopover content={t('common.refresh')}>
                <CButton color="primary" variant="outline" onClick={getConfig} className="ml-1">
                  <CIcon name="cil-sync" content={cilSync} />
                </CButton>
              </CPopover>
            </div>
          </CCardHeader>
          <CCardBody className="py-0 px-0">
            <CNav className="px-2" variant="tabs">
              {configurations.map((conf, index) => (
                <CNavLink
                  key={createUuid()}
                  href="#"
                  active={key === index}
                  id="index"
                  onClick={() => setKey(index)}
                >
                  {conf.name}
                </CNavLink>
              ))}
              <CNavLink key={createUuid()} href="#" onClick={toggle}>
                <CIcon content={cilPlus} color="primary" />
              </CNavLink>
            </CNav>
            <CTabContent>
              <CTabPane active>
                <DeviceConfigurationBody
                  parentConfiguration={config}
                  index={key}
                  refresh={getConfig}
                  refreshConfig={refreshConfig}
                  activeSection={activeSection}
                  setCanSave={setCanSave}
                  baseFields={baseFields}
                  updateBaseWithId={updateBaseWithId}
                  fields={fields}
                  updateWithId={updateWithId}
                  updateField={updateField}
                  setFields={setFields}
                />
              </CTabPane>
            </CTabContent>
          </CCardBody>
          <CModal show={show} onClose={toggle}>
            <CModalHeader className="p-1">
              <CModalTitle className="pl-1 pt-1">{t('configuration.add_new_block')}</CModalTitle>
              <div className="text-right">
                <CPopover content={t('common.close')}>
                  <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
                    <CIcon content={cilX} />
                  </CButton>
                </CPopover>
              </div>
            </CModalHeader>
            <CModalBody>
              <CRow className="pb-4">
                <CCol>{t('configuration.choose_section')}</CCol>
              </CRow>
              <CRow className="py-1">
                <CCol className="text-center">
                  <CButton
                    block
                    color="primary"
                    id="globals"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('globals') >= 0}
                  >
                    Globals
                  </CButton>
                  <CButton
                    block
                    color="primary"
                    id="metrics"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('metrics') >= 0}
                  >
                    Metrics
                  </CButton>
                </CCol>
                <CCol className="text-center">
                  <CButton
                    block
                    color="primary"
                    id="unit"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('unit') >= 0}
                  >
                    Unit
                  </CButton>
                  <CButton
                    block
                    color="primary"
                    id="radios"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('radios') >= 0}
                  >
                    Radios
                  </CButton>
                </CCol>
                <CCol className="text-center">
                  <CButton
                    block
                    color="primary"
                    id="services"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('services') >= 0}
                  >
                    Services
                  </CButton>
                  <CButton
                    block
                    color="primary"
                    id="interfaces"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('interfaces') >= 0}
                  >
                    Interfaces
                  </CButton>
                </CCol>
              </CRow>
            </CModalBody>
          </CModal>
        </CCard>
        <RawJsonConfig orderedBlocks={orderedBlocks} />
      </CCol>
    </CRow>
  );
};

ConfigurationExplorer.propTypes = {
  config: PropTypes.instanceOf(Object).isRequired,
};
export default ConfigurationExplorer;
