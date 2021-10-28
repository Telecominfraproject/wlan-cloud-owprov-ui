import React from 'react';
import PropTypes from 'prop-types';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import {
  CAlert,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPopover,
  CDataTable,
  CSpinner,
} from '@coreui/react';
import { useTranslation } from 'react-i18next';

const ConfigurationPushResultModal = ({ show, toggle, result, loading }) => {
  const { t } = useTranslation();

  const getErrors = () => {
    if (result?.errors) {
      return result.errors.map((r) => ({ text: r }));
    }
    return [];
  };

  const getWarnings = () => {
    if (result?.warnings) {
      return result.warnings.map((r) => ({ text: r }));
    }
    return [];
  };
  return (
    <CModal size="lg" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">Configuration Push Result</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      {loading ? (
        <CModalBody className="text-center">
          <CSpinner />
        </CModalBody>
      ) : (
        <CModalBody>
          {result?.errorCode !== 0 ? (
            <CAlert color="danger">
              Configuration not pushed, error code: {result?.errorCode}
            </CAlert>
          ) : (
            <CAlert color="success">Configuration pushed successfully!</CAlert>
          )}
          <h5>Applied Configuration</h5>
          <pre className="overflow-auto border" style={{ height: '300px' }}>
            {JSON.stringify(result?.appliedConfiguration, null, 2)}
          </pre>
          <h5>Errors</h5>
          <div className="overflow-auto border" style={{ height: '300px' }}>
            <CDataTable
              addTableClasses="table-sm"
              items={getErrors()}
              columns={[{ key: 'text', label: 'Error' }]}
            />
          </div>
          <h5>Warnings</h5>
          <div className="overflow-auto border" style={{ height: '300px' }}>
            <CDataTable
              addTableClasses="table-sm"
              items={getWarnings()}
              columns={[{ key: 'text', label: 'Warning' }]}
            />
          </div>
        </CModalBody>
      )}
    </CModal>
  );
};

ConfigurationPushResultModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  result: PropTypes.instanceOf(Object),
  loading: PropTypes.bool.isRequired,
};

ConfigurationPushResultModal.defaultProps = {
  result: null,
};

export default ConfigurationPushResultModal;
