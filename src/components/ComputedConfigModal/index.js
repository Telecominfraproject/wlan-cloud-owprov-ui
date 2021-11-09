import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from 'utils/axiosInstance';
import { useAuth, useToast } from 'ucentral-libs';
import CIcon from '@coreui/icons-react';
import { cilRouter, cilX } from '@coreui/icons';
import {
  CButton,
  CCollapse,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPopover,
} from '@coreui/react';
import { useTranslation } from 'react-i18next';

const ComputerConfigModal = ({ show, toggle, serialNumber, pushConfig }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentToken, endpoints } = useAuth();
  const [config, setConfig] = useState({});
  const [, setLoading] = useState(false);
  const [shownCollapses, setShownCollapses] = useState([]);

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

  const push = () => {
    toggle();
    pushConfig(serialNumber);
  };

  const toggleCollapse = (index) => {
    const position = shownCollapses.indexOf(index);
    let newShown = shownCollapses.slice();

    if (position !== -1) {
      newShown.splice(position, 1);
    } else {
      newShown = [...shownCollapses, index];
    }
    setShownCollapses(newShown);
  };

  useEffect(() => {
    setShownCollapses([]);
    if (show && serialNumber !== '') getConfig();
  }, [show, serialNumber]);

  return (
    <CModal size="lg" show={show} onClose={() => toggle()}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{serialNumber}</CModalTitle>
        <div className="text-right">
          <CPopover content="Push Configuration to Device">
            <CButton color="primary" variant="outline" onClick={push}>
              <CIcon name="cil-router" content={cilRouter} />
            </CButton>
          </CPopover>
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
          {JSON.stringify(config?.config, null, 2)}
        </pre>
        <h5>{t('configuration.explanation')}</h5>
        <div className="overflow-auto border" style={{ height: '300px' }}>
          {config?.explanation?.map((exp, ind) => (
            <div>
              <CButton
                shape="square"
                block
                color={exp.action === 'added' ? 'success' : 'warning'}
                onClick={() => toggleCollapse(ind)}
              >
                {exp['from-name']}
                {exp.action === 'added' ? '' : `: ${exp.reason}`}
                <CIcon
                  name={shownCollapses.includes(ind) ? 'cilChevronTop' : 'cilChevronBottom'}
                  style={{ color: 'white' }}
                  className="ml-2"
                  size="lg"
                />
              </CButton>
              <CCollapse show={shownCollapses.includes(ind)}>
                <pre>{JSON.stringify(exp, null, 2)}</pre>
              </CCollapse>
            </div>
          ))}
        </div>
      </CModalBody>
    </CModal>
  );
};

ComputerConfigModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  serialNumber: PropTypes.string,
  pushConfig: PropTypes.func.isRequired,
};

ComputerConfigModal.defaultProps = {
  serialNumber: '',
};

export default ComputerConfigModal;
