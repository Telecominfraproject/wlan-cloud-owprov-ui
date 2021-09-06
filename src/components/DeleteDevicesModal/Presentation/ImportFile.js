import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CAlert, CButton, CInputFile, CRow, CCol } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from 'ucentral-libs';
import { readString } from 'react-papaparse';
import { fileToString } from 'utils/fileHelper';
import DeviceDeletePreviewTable from './DeviceDeletePreviewTable';

const transformHeader = (header) => header.replace(/"/g, '');

const ImportFile = ({ refreshId, setImportedDevices, setPhase }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const changeFile = (e) => {
    if (e.target.files?.length > 0) setFile(e.target.files[0]);
  };

  const parseFile = async () => {
    setError(null);
    setLoading(true);

    const fileStr = await fileToString(file);

    if (fileStr === null) {
      setError('General error while parsing file');
    } else {
      const csvConfig = {
        header: true,
        transformHeader,
        quoteChar: '"',
      };

      const data = readString(fileStr, csvConfig);

      if (data.errors.length > 0) {
        setError(`Error on row ${data.errors[0].row}: ${data.errors[0].message}`);
      } else {
        setPreview(data.data);
      }
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
    setError(null);
  }, [refreshId]);

  return (
    <div>
      <CRow>
        <CCol>
          <h6>{t('inventory.bulk_delete_explanation')}</h6>
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
      <CRow>
        <CCol>
          <CAlert hidden={error === null} color="danger">
            {error}
          </CAlert>
        </CCol>
      </CRow>
      <CRow hidden={preview === null} className="py-2">
        <CCol>
          {preview !== null ? (
            <div>
              <p className="pb-2">{t('inventory.showing_top_10')}</p>
              <DeviceDeletePreviewTable devices={preview} countToShow={10} />
            </div>
          ) : (
            <div />
          )}
        </CCol>
      </CRow>
      <CRow hidden={preview === null} className="py-2">
        <CCol>
          <CButton color="primary" onClick={testImport}>
            {t('inventory.bulk_delete_test')}
          </CButton>
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
