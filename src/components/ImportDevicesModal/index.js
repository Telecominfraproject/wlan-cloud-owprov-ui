import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilX } from '@coreui/icons';
import ImportFile from './ImportFile';
import TestImport from './TestImport';

const ImportDevicesModal = ({ show, toggle, entity }) => {
  const { t } = useTranslation();
  /**
   * Phase 0 (explanations and import file)
   * Phase 1 (testing of the imported devices, showing the results and asking choices)
   * Phase 3 using API to do actions chosen and showing results
   */
  const [phase, setPhase] = useState(0);
  const [refreshId, setRefreshId] = useState(0);
  const [importedDevices, setImportedDevices] = useState([]);

  const reset = () => {
    setPhase(0);
    setRefreshId(refreshId + 1);
  };

  const getPhase = () => {
    switch (phase) {
      case 0:
        return (
          <ImportFile
            setImportedDevices={setImportedDevices}
            setPhase={setPhase}
            refreshId={refreshId}
          />
        );
      case 1:
        return <TestImport importedDevices={importedDevices} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    reset();
  }, [show]);

  return (
    <CModal show={show} onClose={toggle} size="xl">
      <CModalHeader>
        <CModalTitle>
          {entity !== null
            ? t('inventory.import_devices_to', { name: entity?.name })
            : t('inventory.import_devices')}
        </CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.back_to_start')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={reset}>
              <CIcon content={cilArrowLeft} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody>{getPhase()}</CModalBody>
    </CModal>
  );
};

ImportDevicesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  entity: PropTypes.instanceOf(Object).isRequired,
};

export default ImportDevicesModal;
