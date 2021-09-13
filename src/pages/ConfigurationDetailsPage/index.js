import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import ConfigurationInfoCard from 'components/ConfigurationInfoCard';

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
          <pre>{JSON.stringify(config, null, '\t')}</pre>
        </CCol>
      </CRow>
    </div>
  );
};

export default ConfigurationDetailsPage;
