import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CCollapse, CCard, CCardHeader, CCardBody } from '@coreui/react';
import TestResultTable from './TestResultTable';
import ResultTable from '../ImportPush/ResultTable';

const TestResults = ({ results }) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(0);

  return (
    <div>
      <CCard className="mb-0">
        <CCardHeader className="p-0">
          <CButton
            color="link"
            active={activeKey === 1}
            onClick={() => (activeKey === 1 ? setActiveKey(0) : setActiveKey(1))}
            block
          >
            {t('inventory.devices_not_found', { number: results.good.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 1}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <TestResultTable devices={results.good} countToShow={999999} />
          </CCardBody>
        </CCollapse>
      </CCard>
      <CCard className="mb-0">
        <CCardHeader className="p-0">
          <CButton
            color="link"
            active={activeKey === 2}
            onClick={() => (activeKey === 2 ? setActiveKey(0) : setActiveKey(2))}
            block
          >
            {t('inventory.devices_found_unassigned', { number: results.foundNotAssigned.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 2}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <TestResultTable devices={results.foundNotAssigned} countToShow={999999} />
          </CCardBody>
        </CCollapse>
      </CCard>
      <CCard className="mb-0">
        <CCardHeader className="p-0">
          <CButton
            color="link"
            active={activeKey === 3}
            onClick={() => (activeKey === 3 ? setActiveKey(0) : setActiveKey(3))}
            block
          >
            {t('inventory.devices_found_assigned', { number: results.foundAssigned.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 3}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <TestResultTable devices={results.foundAssigned} assigned countToShow={999999} />
          </CCardBody>
        </CCollapse>
      </CCard>
      <CCard className="mb-0">
        <CCardHeader className="p-0">
          <CButton
            color="link"
            active={activeKey === 5}
            onClick={() => (activeKey === 5 ? setActiveKey(0) : setActiveKey(5))}
            block
          >
            {t('inventory.error_within_file', { number: results.wrongInFile.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 5}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <ResultTable devices={results.wrongInFile} error />
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
