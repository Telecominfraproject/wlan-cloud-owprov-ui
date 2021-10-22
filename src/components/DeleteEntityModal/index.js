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
import { useEntity, useAuth, useToast } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';

const DeleteEntityModal = ({ show, toggle }) => {
  const { t } = useTranslation();
  const { entity, deleteEntity } = useEntity();
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
      .get(
        `${endpoints.owprov}/api/v1/${entity.isVenue ? 'venue' : 'entity'}/${entity.uuid}`,
        options,
      )
      .then((response) => {
        if (
          response.data.children.length > 0 ||
          response.data.venues?.length > 0 ||
          response.data.locations?.length > 0 ||
          response.data.contacts?.length > 0
        ) {
          setCanDelete(false);
        } else {
          setCanDelete(true);
        }
      })
      .catch(() => {
        setCanDelete(false);
      });
  };

  const deleteEntityApi = () => {
    setLoading(true);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .delete(
        `${endpoints.owprov}/api/v1/${entity.isVenue ? 'venue' : 'entity'}/${entity.uuid}`,
        options,
      )
      .then(() => {
        addToast({
          title: t('common.success'),
          body: entity.isVenue
            ? t('inventory.successful_venue_delete')
            : t('entity.delete_success'),
          color: 'success',
          autohide: true,
        });
        deleteEntity(entity);
        toggle();
      })
      .catch(() => {
        setResult({
          success: false,
          error: t('inventory.deletion_failure'),
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
        return <CAlert color="danger">{t('entity.cannot_delete')}</CAlert>;
      }
      return <CAlert color="danger">{t('entity.delete_warning')}</CAlert>;
    }
    if (result.success) {
      return <CAlert color="success">{t('entity.delete_success')}</CAlert>;
    }
    return <CAlert color="danger">{result.error}</CAlert>;
  };

  return (
    <CModal className="text-dark" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">
          {t('common.delete')} {entity?.name}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-5">{body()}</CModalBody>
      <CModalFooter>
        {result === null && canDelete ? (
          <>
            <CButton disabled={loading} color="primary" onClick={deleteEntityApi}>
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

DeleteEntityModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default DeleteEntityModal;
