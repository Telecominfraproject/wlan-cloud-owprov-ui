import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CCollapse, CCard, CCardHeader, CCardBody } from '@coreui/react';
import DeviceImportPreviewTable from './DeviceImportPreviewTable';

const TestResults = ({ results }) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(0);

  return (
    <div>
      <CCard className="mb-0">
        <CCardHeader className="p-0">
          <CButton
            color="primary"
            block
            active={activeKey === 1}
            onClick={() => (activeKey === 1 ? setActiveKey(0) : setActiveKey(1))}
            variant="outline"
          >
            {t('inventory.devices_not_found', { number: results.good.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 1}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <DeviceImportPreviewTable devices={results.good} countToShow={999999} />
          </CCardBody>
        </CCollapse>
      </CCard>
      <CCard className="mb-0">
        <CCardHeader className="p-0">
          <CButton
            color="primary"
            block
            active={activeKey === 2}
            onClick={() => (activeKey === 2 ? setActiveKey(0) : setActiveKey(2))}
            variant="outline"
          >
            {t('inventory.devices_found_unassigned', { number: results.foundNotAssigned.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 2}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <DeviceImportPreviewTable devices={results.foundNotAssigned} countToShow={999999} />
          </CCardBody>
        </CCollapse>
      </CCard>
      <CCard className="mb-0">
        <CCardHeader className="p-0">
          <CButton
            color="primary"
            block
            active={activeKey === 3}
            onClick={() => (activeKey === 3 ? setActiveKey(0) : setActiveKey(3))}
            variant="outline"
          >
            {t('inventory.devices_found_assigned', { number: results.foundAssigned.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 3}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <DeviceImportPreviewTable devices={results.foundAssigned} countToShow={999999} />
          </CCardBody>
        </CCollapse>
      </CCard>
    </div>
  );
};

TestResults.propTypes = {
  results: PropTypes.instanceOf(Object).isRequired,
};

export default TestResults;
