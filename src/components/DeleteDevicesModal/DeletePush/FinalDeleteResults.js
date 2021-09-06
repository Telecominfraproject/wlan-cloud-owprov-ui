import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CCollapse, CCard, CCardHeader, CCardBody } from '@coreui/react';
import ResultTable from './ResultTable';
import DeviceDeletePreviewTable from '../Presentation/DeviceDeletePreviewTable';

const FinalDeleteResults = ({ results }) => {
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
            {t('inventory.deleted_devices', { number: results.deleteSuccess.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 1}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <DeviceDeletePreviewTable devices={results.deleteSuccess} countToShow={999999} />
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
            {t('inventory.unassigned_deleted_devices', {
              number: results.deleteUnassignSuccess.length,
            })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 2}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <DeviceDeletePreviewTable
              devices={results.deleteUnassignSuccess}
              countToShow={999999}
            />
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
            {t('inventory.delete_errors', { number: results.errors.length })}
          </CButton>
        </CCardHeader>
        <CCollapse show={activeKey === 4}>
          <CCardBody className="overflow-auto" style={{ height: '300px' }}>
            <ResultTable devices={results.errors} error />
          </CCardBody>
        </CCollapse>
      </CCard>
    </div>
  );
};

FinalDeleteResults.propTypes = {
  results: PropTypes.instanceOf(Object).isRequired,
};

export default FinalDeleteResults;
