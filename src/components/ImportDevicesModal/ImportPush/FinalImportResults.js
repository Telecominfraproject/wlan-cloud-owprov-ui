import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CCollapse, CCard, CCardHeader, CCardBody } from '@coreui/react';
import ResultTable from './ResultTable';

const FinalImportResults = ({ results }) => {
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
            {t('inventory.devices_created', { number: results.creationSuccess.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 1}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <ResultTable devices={results.creationSuccess} />
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
            {t('inventory.devices_errors_while_creating', {
              number: results.creationErrors.length,
            })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 2}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <ResultTable devices={results.creationErrors} error />
          </CCardBody>
        </CCollapse>
      </CCard>
      <CCard className="mb-0">
        <CCardHeader className="p-0">
          <CButton
            color="link"
            active={activeKey === 4}
            onClick={() => (activeKey === 4 ? setActiveKey(0) : setActiveKey(4))}
            block
          >
            {t('inventory.devices_assigned', { number: results.updateSuccess.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 4}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <ResultTable devices={results.updateSuccess} />
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
            {t('inventory.devices_errors_while_updating', { number: results.updateErrors.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 3}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <ResultTable devices={results.updateErrors} error />
          </CCardBody>
        </CCollapse>
      </CCard>
    </div>
  );
};

FinalImportResults.propTypes = {
  results: PropTypes.instanceOf(Object).isRequired,
};

export default FinalImportResults;
