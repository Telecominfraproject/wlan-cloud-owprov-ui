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
import { cilPlus, cilX } from '@coreui/icons';
import { useAuth, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import DeviceConfigurationBody from 'components/DeviceConfigurationBody';

const blocksObj = {
  unit: {},
  globals: {},
  metrics: {},
  services: {},
  radios: {},
  interfaces: {},
};

const ConfigurationExplorer = ({ config }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [show, setShow] = useState(false);
  const [configurations, setConfigurations] = useState([]);
  const [orderedBlocks, setOrderedBlocks] = useState(blocksObj);
  const [existingSections, setExistingSections] = useState([]);
  const [newBlock, setNewBlock] = useState({});
  const [newSection, setNewSection] = useState(null);
  const [key, setKey] = useState(0);

  const toggle = () => setShow(!show);

  const getConfig = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/configurations/${config.id}`, options)
      .then((response) => {
        // Parsing the nested configurations array into JSON objects
        const createdSections = [];
        const newConfigObj = { ...blocksObj };
        const configs = response.data.configuration.map((conf) => {
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

        setOrderedBlocks(newConfigObj);
        setNewSection(null);
        setExistingSections(createdSections);
        setConfigurations(configs);
        if (key >= configs.length) {
          if (configs.length > 0) setKey(0);
          else setKey(-1);
        }
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

  const chooseNewSection = (e) => {
    setNewSection(e.target.id);
    setKey(-1);
    toggle();
  };

  useEffect(() => {
    if (config) getConfig();
  }, [config]);

  useEffect(() => {
    if (newBlock) {
      const newOrderedBlocks = { ...orderedBlocks };
      try {
        const json = JSON.parse(newBlock);
        const activeSection = Object.keys(json)[0];
        if (activeSection) {
          newOrderedBlocks[activeSection] = json;
        }
        setOrderedBlocks({ ...newOrderedBlocks });
      } catch {
        setOrderedBlocks({ ...newOrderedBlocks });
      }
    }
  }, [newBlock]);

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader className="p-1">
            <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
              Configuration Blocks
            </div>
          </CCardHeader>
          <CCardBody className="px-2 pt-0">
            <CNav variant="tabs">
              {configurations.map((conf, index) => (
                <CNavLink
                  key={createUuid()}
                  href="#"
                  active={key === index}
                  onClick={() => setKey(index)}
                >
                  {conf.name}
                </CNavLink>
              ))}
              <CNavLink key={createUuid()} href="#" active={key === -1} onClick={toggle}>
                <CIcon content={cilPlus} color="primary" />
              </CNavLink>
            </CNav>
            <CTabContent className="py-2">
              <CTabPane active>
                <DeviceConfigurationBody
                  parentConfiguration={config}
                  setNewBlock={setNewBlock}
                  config={key === -1 ? null : configurations[key]}
                  sectionToCreate={newSection}
                  index={key}
                  refresh={getConfig}
                  toggleSectionChoice={toggle}
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
                    color="primary"
                    id="globals"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('globals') >= 0}
                  >
                    Globals
                  </CButton>
                </CCol>
              </CRow>
              <CRow className="py-1">
                <CCol className="text-center">
                  <CButton
                    color="primary"
                    id="unit"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('unit') >= 0}
                  >
                    Unit
                  </CButton>
                </CCol>
              </CRow>
              <CRow className="py-1">
                <CCol className="text-center">
                  <CButton
                    color="primary"
                    id="services"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('services') >= 0}
                  >
                    Services
                  </CButton>
                </CCol>
              </CRow>
              <CRow className="py-1">
                <CCol className="text-center">
                  <CButton
                    color="primary"
                    id="metrics"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('metrics') >= 0}
                  >
                    Metrics
                  </CButton>
                </CCol>
              </CRow>
              <CRow className="py-1">
                <CCol className="text-center">
                  <CButton
                    color="primary"
                    id="radios"
                    onClick={chooseNewSection}
                    disabled={existingSections.indexOf('radios') >= 0}
                  >
                    Radios
                  </CButton>
                </CCol>
              </CRow>
              <CRow className="py-1">
                <CCol className="text-center">
                  <CButton
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
        <CCard>
          <CCardHeader className="p-1">
            <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
              Resulting Raw JSON Configuration
            </div>
          </CCardHeader>
          <CCardBody>
            &#123;
            {Object.keys(orderedBlocks.unit).length > 0 ? (
              <pre className="pl-3">{JSON.stringify(orderedBlocks.unit, null, '\t')},</pre>
            ) : null}
            {Object.keys(orderedBlocks.globals).length > 0 ? (
              <pre className="pl-3">{JSON.stringify(orderedBlocks.globals, null, '\t')},</pre>
            ) : null}
            {Object.keys(orderedBlocks.metrics).length > 0 ? (
              <pre className="pl-3">{JSON.stringify(orderedBlocks.metrics, null, '\t')},</pre>
            ) : null}
            {Object.keys(orderedBlocks.services).length > 0 ? (
              <pre className="pl-3">{JSON.stringify(orderedBlocks.services, null, '\t')},</pre>
            ) : null}
            {Object.keys(orderedBlocks.radios).length > 0 ? (
              <pre className="pl-3">{JSON.stringify(orderedBlocks.radios, null, '\t')},</pre>
            ) : null}
            {Object.keys(orderedBlocks.interfaces).length > 0 ? (
              <pre className="pl-3">{JSON.stringify(orderedBlocks.interfaces, null, '\t')},</pre>
            ) : null}
            &#125;
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

ConfigurationExplorer.propTypes = {
  config: PropTypes.instanceOf(Object).isRequired,
};
export default ConfigurationExplorer;
