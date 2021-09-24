import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CAlert,
} from '@coreui/react';
import { useAuth, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const DeleteConfigurationModal = ({ show, toggle, config }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [result, setResult] = useState(null);
  const [canDelete, setCanDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkIfChildless = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/configurations/${config.id}`, options)
      .then((response) => {
        if (response.data.inUse.length > 0) {
          setCanDelete(false);
        } else {
          setCanDelete(true);
        }
      })
      .catch(() => {
        setCanDelete(false);
      });
  };

  const deleteConfig = () => {
    setLoading(true);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .delete(`${endpoints.owprov}/api/v1/configurations/${config.id}`, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('configuration.successful_delete'),
          color: 'success',
          autohide: true,
        });
        toggle();
        history.push('/configuration');
      })
      .catch((e) => {
        setResult({
          success: false,
          error: t('configuration.error_trying_delete', {
            error: e.response?.data?.ErrorDescription,
          }),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (show) {
      setResult(null);
      checkIfChildless();
    }
  }, [show]);

  const body = () => {
    if (!result) {
      if (!canDelete) {
        return <CAlert color="danger">{t('configuration.cannot_delete')}</CAlert>;
      }
      return <CAlert color="danger">{t('entity.delete_warning')}</CAlert>;
    }
    return <CAlert color="danger">{result.error}</CAlert>;
  };

  return (
    <CModal className="text-dark" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">
          {t('common.delete')} {config?.name}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-5">{body()}</CModalBody>
      <CModalFooter>
        {result === null && canDelete ? (
          <>
            <CButton disabled={loading} color="primary" onClick={deleteConfig}>
              {t('common.delete')}
            </CButton>
            <CButton color="secondary" onClick={toggle}>
              {t('common.close')}
            </CButton>
          </>
        ) : (
          <CButton block color="secondary" onClick={toggle}>
            {t('common.close')}
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
};

DeleteConfigurationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  config: PropTypes.instanceOf(Object),
};

DeleteConfigurationModal.defaultProps = {
  config: null,
};

export default DeleteConfigurationModal;
