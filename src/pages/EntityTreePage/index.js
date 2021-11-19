import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { CRow, CCol } from '@coreui/react';
import TreeCard from './TreeCard';

const EntityTreePage = () => (
  <ReactFlowProvider>
    <CRow>
      <CCol>
        <TreeCard />
      </CCol>
    </CRow>
  </ReactFlowProvider>
);

export default EntityTreePage;
