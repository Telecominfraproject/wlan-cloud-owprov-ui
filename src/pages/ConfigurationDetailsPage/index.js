import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import axiosInstance from 'utils/axiosInstance';
import { useAuth } from 'ucentral-libs';
import ConfigurationDetails from 'components/ConfigurationDetails';

const ConfigurationDetailsPage = () => {
  const { currentToken, endpoints } = useAuth();
  const { configId } = useParams();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

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
        const configurations = response.data.configuration.map((conf) => ({
          ...conf,
          configuration: JSON.parse(conf.configuration),
        }));
        const newConfig = response.data;
        newConfig.configuration = configurations;

        setConfig(newConfig);
      })
      .catch(() => {
        setConfig(null);
      })
      .finally(() => setLoading(false));
  };

  const refresh = () => getConfig();

  useEffect(() => {
    if (configId && configId !== '') getConfig();
  }, []);

  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationDetails loading={loading} refresh={refresh} config={config} />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <pre>{JSON.stringify(config, null, '\t')}</pre>
        </CCol>
      </CRow>
    </div>
  );
};

export default ConfigurationDetailsPage;
