import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CCard, CCardHeader, CCardBody, CForm, CLabel, CRow, CCol } from '@coreui/react';
import { useAuth, useToast, NotesTable } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import axiosInstance from 'utils/axiosInstance';
import { prettyDate } from 'utils/helper';

const ConfigurationDetails = ({ config, refresh }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentToken, endpoints } = useAuth();
  const [loading, setLoading] = useState(false);

  const addNote = (newNote) => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {
      id: config.id,
      notes: [{ note: newNote }],
    };

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/configurations/${config.id}`, parameters, options)
      .then(() => {
        refresh();
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('common.error_adding_note'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
    setLoading(false);
  };

  return (
    <CCard>
      <CCardHeader>
        <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
          {config?.name}
        </div>
      </CCardHeader>
      <CCardBody>
        {config !== null ? (
          <CForm>
            <CRow>
              <CCol>
                <CRow className="py-2">
                  <CLabel xxl="3" col htmlFor="name">
                    <div>{t('user.name')}:</div>
                  </CLabel>
                  <CCol xxl="9">
                    <p className="mt-2 mb-0">{config.name}</p>
                  </CCol>
                </CRow>
                <CRow className="py-2">
                  <CLabel xxl="3" col htmlFor="name">
                    <div>{t('user.description')}:</div>
                  </CLabel>
                  <CCol xxl="9">
                    <p className="mt-2 mb-0">{config.description}</p>
                  </CCol>
                </CRow>
                <CRow className="py-2">
                  <CLabel xxl="3" col htmlFor="name">
                    <div>{t('common.created')}:</div>
                  </CLabel>
                  <CCol xxl="9">
                    <p className="mt-2 mb-0">{prettyDate(config.created)}</p>
                  </CCol>
                </CRow>
                <CRow className="py-2">
                  <CLabel xxl="3" col htmlFor="name">
                    <div>{t('common.modified')}:</div>
                  </CLabel>
                  <CCol xxl="9">
                    <p className="mt-2 mb-0">{prettyDate(config.modified)}</p>
                  </CCol>
                </CRow>
              </CCol>
              <CCol>
                <NotesTable
                  t={t}
                  notes={config.notes}
                  addNote={addNote}
                  loading={loading}
                  editable
                />
              </CCol>
            </CRow>
          </CForm>
        ) : null}
      </CCardBody>
    </CCard>
  );
};

ConfigurationDetails.propTypes = {
  refresh: PropTypes.func.isRequired,
  config: PropTypes.instanceOf(Object),
};

ConfigurationDetails.defaultProps = {
  config: null,
};

export default ConfigurationDetails;
