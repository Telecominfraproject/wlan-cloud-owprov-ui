import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useAuth, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import Modal from './Modal';

const ConfigurationInUseModal = ({ show, toggle, config }) => {
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
      .get(`${endpoints.owprov}/api/v1/configurations/${config.id}?expandInUse=true`, options)
      .then((response) => {
        setDetails(response.data.entries);
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
  }, [show]);

  return <Modal t={t} show={show} toggle={toggle} config={config} details={details} />;
};

ConfigurationInUseModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  config: PropTypes.instanceOf(Object),
};

ConfigurationInUseModal.defaultProps = {
  config: null,
};

export default ConfigurationInUseModal;
