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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import { useAuth, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import DeviceConfigurationBody from 'components/DeviceConfigurationBody';

const ConfigurationExplorer = ({ config }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [configurations, setConfigurations] = useState([]);
  const [key, setKey] = useState(0);

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
        const configs = response.data.configuration.map((conf) => ({
          ...conf,
          configuration: JSON.parse(conf.configuration),
        }));
        setConfigurations(configs);
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

  useEffect(() => {
    if (config) getConfig();
  }, [config]);

  return (
    <CCard>
      <CCardHeader className="p-1">
        <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
          {t('configuration.configurations')}
        </div>
      </CCardHeader>
      <CCardBody>
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
          <CNavLink key={createUuid()} href="#" active={key === -1} onClick={() => setKey(-1)}>
            <CIcon content={cilPlus} color="primary" />
          </CNavLink>
        </CNav>
        <CTabContent className="py-2">
          <CTabPane key={createUuid()} active={key === -1}>
            <DeviceConfigurationBody config={null} />
          </CTabPane>
          {configurations.map((conf, index) => (
            <CTabPane key={createUuid()} active={key === index}>
              <DeviceConfigurationBody config={conf} />
            </CTabPane>
          ))}
        </CTabContent>
      </CCardBody>
    </CCard>
  );
};

ConfigurationExplorer.propTypes = {
  config: PropTypes.instanceOf(Object),
};

ConfigurationExplorer.defaultProps = {
  config: null,
};

export default ConfigurationExplorer;
