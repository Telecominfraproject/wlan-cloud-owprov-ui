import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CAlert, CButton, CInputFile, CRow, CCol } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from 'ucentral-libs';
import { fileToString, deviceFilestringToArray } from 'utils/fileHelper';
import DeviceImportPreviewTable from './DeviceImportPreviewTable';

const ImportFile = ({ refreshId, setImportedDevices, setPhase }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(false);

  const changeFile = (e) => {
    if (e.target.files?.length > 0) setFile(e.target.files[0]);
  };

  const parseFile = async () => {
    setLoading(true);

    const fileStr = await fileToString(file);
    const arr = deviceFilestringToArray(fileStr);
    if (arr === null) {
      setError(true);
    } else {
      setPreview(arr);
    }
    setLoading(false);
  };

  const testImport = () => {
    setImportedDevices(preview);
    setPhase(1);
  };

  useEffect(() => {
    setLoading(false);
    setFile(null);
    setPreview(null);
    setFileKey(fileKey + 1);
    setError(false);
  }, [refreshId]);

  return (
    <div>
      <CRow>
        <CCol>
          <h6>{t('inventory.import_devices_explanation')}</h6>
        </CCol>
      </CRow>
      <CRow className="py-2">
        <CCol>
          <CInputFile
            id="file-input"
            name="file-input"
            accept=".csv"
            onChange={changeFile}
            key={fileKey}
          />
        </CCol>
      </CRow>
      <CRow className="py-2">
        <CCol>
          <LoadingButton
            color="primary"
            label={t('common.preview')}
            disabled={file === null || loading}
            isLoading={loading}
            isLoadingLabel={t('common.loading_ellipsis')}
            block={false}
            action={parseFile}
          />
        </CCol>
      </CRow>
      <CRow className="py-2">
        <CCol>
          {preview !== null ? (
            <div>
              <p className="pb-2">{t('inventory.showing_top_10')}</p>
              <DeviceImportPreviewTable devices={preview} countToShow={10} />
            </div>
          ) : (
            <div />
          )}
        </CCol>
      </CRow>
      <CRow className="py-2">
        <CCol hidden={preview === null}>
          <CButton color="primary" onClick={testImport}>
            {t('inventory.test_import')}
          </CButton>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CAlert hidden={!error} color="danger">
            {t('inventory.file_error')}
          </CAlert>
        </CCol>
      </CRow>
    </div>
  );
};

ImportFile.propTypes = {
  refreshId: PropTypes.number.isRequired,
  setImportedDevices: PropTypes.func.isRequired,
  setPhase: PropTypes.func.isRequired,
};

export default ImportFile;
