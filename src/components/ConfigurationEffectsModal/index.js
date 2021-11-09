import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPopover,
  CLink,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import { useAuth, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { v4 as createUuid } from 'uuid';

const ConfigurationEffectsModal = ({ show, toggle, config }) => {
  const [gwUi] = useState(localStorage.getItem('owgw-ui'));
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [details, setDetails] = useState(null);

  const getDetails = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/configurations/${config.id}?computedAffected=true`, options)
      .then((response) => {
        setDetails(response.data);
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('configuration.error_fetching_config'),
          color: 'danger',
          autohide: true,
        });
      });
  };

  useEffect(() => {
    if (show && config) getDetails();
  }, [config?.id]);

  return (
    <CModal size="lg" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{config?.name}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody>
        <h6>
          {t('configuration.devices_affected')} {details?.affectedDevices?.length}
        </h6>
        <div className="overflow-auto border pt-1 mb-1" style={{ height: '500px' }}>
          <ul>
            {details?.affectedDevices?.map((d) => (
              <li key={createUuid()}>
                <CLink
                  className="c-subheader-nav-link align-self-center"
                  aria-current="page"
                  href={`${gwUi}/#/devices/${d}`}
                  target="_blank"
                  disabled={!gwUi || gwUi === ''}
                >
                  {d}
                </CLink>
              </li>
            ))}
          </ul>
        </div>
      </CModalBody>
    </CModal>
  );
};

ConfigurationEffectsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  config: PropTypes.instanceOf(Object),
};

ConfigurationEffectsModal.defaultProps = {
  config: null,
};

export default ConfigurationEffectsModal;
