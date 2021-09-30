import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from 'utils/axiosInstance';
import { useAuth, useToast } from 'ucentral-libs';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CPopover } from '@coreui/react';
import { useTranslation } from 'react-i18next';

const ComputerConfigModal = ({ show, toggle, serialNumber }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentToken, endpoints } = useAuth();
  const [config, setConfig] = useState({});
  const [, setLoading] = useState(false);

  const getConfig = () => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/inventory/${serialNumber}?config=true&explain=true`, options)
      .then((response) => {
        setConfig(response.data);
      })
      .catch(() => {
        setConfig(null);
        addToast({
          title: t('common.error'),
          body: t('configuration.error_fetching_config'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (show && serialNumber !== '') getConfig();
  }, [show, serialNumber]);

  return (
    <CModal size="lg" show={show} onClose={() => toggle()}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{serialNumber}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={() => toggle()}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody>
        <h5>{t('configuration.title')}</h5>
        <pre className="overflow-auto border" style={{ height: '300px' }}>
          {JSON.stringify(config?.config, null, '\t')}
        </pre>
        <h5>{t('configuration.explanation')}</h5>
        <pre className="overflow-auto border" style={{ height: '300px' }}>
          {JSON.stringify(config?.explanation, null, '\t')}
        </pre>
      </CModalBody>
    </CModal>
  );
};

ComputerConfigModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  serialNumber: PropTypes.string,
};

ComputerConfigModal.defaultProps = {
  serialNumber: '',
};

export default ComputerConfigModal;
