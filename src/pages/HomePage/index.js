import React from 'react';
import { CCard, CCardBody } from '@coreui/react';
import { useParams } from 'react-router-dom';

const HomePage = () => {
  const { entityId } = useParams();
  return (
    <CCard>
      <CCardBody>{entityId}</CCardBody>
    </CCard>
  );
};

export default HomePage;
