import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import ConfigurationInfoCard from 'components/ConfigurationInfoCard';
import ConfigurationExplorer from 'components/ConfigurationExplorer';

const ConfigurationDetailsPage = () => {
  const { configId } = useParams();
  const [config, setConfig] = useState(null);

  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationInfoCard configId={configId} config={config} setConfig={setConfig} />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <ConfigurationExplorer config={config} />
        </CCol>
      </CRow>
    </div>
  );
};

export default ConfigurationDetailsPage;
