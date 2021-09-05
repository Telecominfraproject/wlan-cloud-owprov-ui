import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CSpinner, CProgress, CProgressBar, CRow, CCol } from '@coreui/react';
import { useAuth, useEntity } from 'ucentral-libs';
import axios from 'axios';
import axiosInstance from 'utils/axiosInstance';
import TestResults from './TestResults';
import ImportChoices from './ImportChoices';

const initialResults = {
  good: [],
  foundNotAssigned: [],
  foundAssigned: [],
  wrongInFile: [],
};

const initialChoices = {
  reassign: false,
  assignUnassigned: false,
};

const TestImport = ({ importedDevices, setPhase, setGroupedDevices, setImportChoices }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { deviceTypes } = useEntity();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(initialResults);
  const [percentTreated, setPercentTreated] = useState(0);
  const [treating, setTreating] = useState('');
  const [choices, setChoices] = useState(initialChoices);

  const startImport = () => {
    setGroupedDevices(results);
    setImportChoices(choices);
    setPhase(2);
  };

  const getDevice = (device, source) => {
    const deviceResult = {
      found: false,
      alreadyAssigned: false,
    };

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      cancelToken: source.token,
    };

    return axiosInstance
      .get(`${endpoints.owprov}/api/v1/inventory/${device.SerialNumber}`, options)
      .then((response) => {
        deviceResult.found = true;
        if (response.data.venue !== '') {
          deviceResult.venue = response.data.venue !== '' ? response.data.venue : undefined;
          deviceResult.alreadyAssigned = true;
        } else if (response.data.entity !== '') {
          deviceResult.entity = response.data.entity;
          deviceResult.alreadyAssigned = true;
        }
        return deviceResult;
      })
      .catch((e) => {
        if (axios.isCancel(e)) return { stop: true };
        return deviceResult;
      });
  };

  const verifyParameters = (device, treatedSerialNumbers) => {
    if (device.SerialNumber === '') return t('inventory.serial_number_required');
    if (!deviceTypes.find((deviceType) => deviceType === device.DeviceType))
      return t('inventory.type_invalid');
    if (treatedSerialNumbers.find((serial) => serial === device.SerialNumber))
      return t('inventory.duplicate_serial');
    return null;
  };

  const testImport = async (source) => {
    setResults(initialResults);
    setLoading(true);

    // Array for duplicate
    const treatedSerialNumbers = [];

    // Result arrays
    const good = [];
    const foundNotAssigned = [];
    const foundAssigned = [];
    const wrongInFile = [];

    const numberOfDevices = importedDevices.length;
    for (let i = 0; i < numberOfDevices; i += 1) {
      const device = importedDevices[i];
      setTreating(device.SerialNumber);

      const testError = verifyParameters(device, treatedSerialNumbers);
      if (testError === null) {
        // eslint-disable-next-line no-await-in-loop
        const result = await getDevice(device, source);
        if (result.stop) break;
        if (result.found) {
          if (result.alreadyAssigned) {
            foundAssigned.push({
              ...device,
              ...{ entity: result.entity ?? '', venue: result.venue ?? '' },
            });
          } else {
            foundNotAssigned.push(device);
          }
        } else {
          good.push(device);
        }
      } else {
        wrongInFile.push({ ...device, ...{ error: testError } });
      }
      treatedSerialNumbers.push(device.SerialNumber);
      setPercentTreated(Math.floor((i / numberOfDevices) * 100));
    }

    setResults({
      good,
      foundNotAssigned,
      foundAssigned,
      wrongInFile,
    });

    setLoading(false);
  };

  const getResults = () => {
    if (
      results.foundAssigned.length > 0 ||
      results.foundNotAssigned.length > 0 ||
      results.wrongInFile.length > 0
    ) {
      return <TestResults results={results} />;
    }
    if (results.good.length > 0) {
      return <h6>{t('inventory.passed_tests')}</h6>;
    }
    return <h6>{t('inventory.no_devices_to_import')}</h6>;
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    if (importedDevices.length > 0) {
      testImport(source);
    }
    return () => {
      source.cancel('axios request cancelled');
    };
  }, [importedDevices]);

  if (loading) {
    return (
      <div>
        <CRow className="py-2">
          <CCol className="text-center">
            <CSpinner />
          </CCol>
        </CRow>
        <CRow className="pt-2">
          <CCol>
            <h6>
              {t('inventory.validating_import_file')} {treating}
            </h6>
          </CCol>
        </CRow>
        <CRow className="py-2">
          <CCol className="text-center">
            <CProgress height={20} className="mb-3">
              <CProgressBar value={percentTreated} animated>
                {percentTreated}% {t('inventory.devices_tested')}
              </CProgressBar>
            </CProgress>
          </CCol>
        </CRow>
      </div>
    );
  }
  return (
    <div>
      <CRow className="py-2">
        <CCol>
          <h5 className="pb-3">{t('inventory.test_results')}</h5>
          {getResults()}
        </CCol>
      </CRow>
      <CRow
        hidden={results.foundAssigned.length === 0 && results.foundNotAssigned.length === 0}
        className="py-2"
      >
        <CCol>
          <ImportChoices testResults={results} choices={choices} setChoices={setChoices} />
        </CCol>
      </CRow>
      <CRow className="pt-4 pb-2">
        <CCol>
          {results.good.length !== 0 ||
          results.foundNotAssigned.length !== 0 ||
          results.foundAssigned.length !== 0 ? (
            <CButton color="primary" onClick={startImport}>
              {t('inventory.import_devices')}
            </CButton>
          ) : (
            <h6>{t('inventory.no_devices_to_import')}</h6>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

TestImport.propTypes = {
  importedDevices: PropTypes.instanceOf(Array),
  setPhase: PropTypes.func.isRequired,
  setGroupedDevices: PropTypes.func.isRequired,
  setImportChoices: PropTypes.func.isRequired,
};

TestImport.defaultProps = {
  importedDevices: [],
};

export default TestImport;
