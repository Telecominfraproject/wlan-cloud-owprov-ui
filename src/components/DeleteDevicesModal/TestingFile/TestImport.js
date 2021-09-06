import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CSpinner, CProgress, CProgressBar, CRow, CCol } from '@coreui/react';
import { useAuth } from 'ucentral-libs';
import axios from 'axios';
import axiosInstance from 'utils/axiosInstance';
import TestResults from './TestResults';
import DeleteChoices from './DeleteChoices';

const initialResults = {
  assigned: [],
  notAssigned: [],
  notFound: [],
  wrongInFile: [],
};

const initialChoices = {
  unassign: false,
};

const TestImport = ({ importedDevices, setPhase, setGroupedDevices, setImportChoices }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
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
    const assigned = [];
    const notAssigned = [];
    const notFound = [];
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
            assigned.push({
              ...device,
              ...{ entity: result.entity ?? '', venue: result.venue ?? '' },
            });
          } else {
            notAssigned.push(device);
          }
        } else {
          notFound.push(device);
        }
      } else {
        wrongInFile.push({ ...device, ...{ error: testError } });
      }
      treatedSerialNumbers.push(device.SerialNumber);
      setPercentTreated(Math.floor((i / numberOfDevices) * 100));
    }

    setResults({
      assigned,
      notAssigned,
      notFound,
      wrongInFile,
    });

    setLoading(false);
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
          <TestResults results={results} />
        </CCol>
      </CRow>
      <CRow hidden={results.assigned.length === 0} className="py-2">
        <CCol>
          <DeleteChoices testResults={results} choices={choices} setChoices={setChoices} />
        </CCol>
      </CRow>
      <CRow className="pt-4 pb-2">
        <CCol>
          {results.assigned.length !== 0 || results.notAssigned.length !== 0 ? (
            <CButton color="primary" onClick={startImport}>
              {t('inventory.delete_devices')}
            </CButton>
          ) : (
            <h6>{t('inventory.no_devices_to_delete')}</h6>
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
