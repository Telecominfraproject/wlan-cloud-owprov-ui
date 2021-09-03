import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CSpinner, CProgress, CProgressBar, CRow, CCol } from '@coreui/react';
import { useAuth } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import TestResults from './TestResults';

const initialResults = {
  good: [],
  foundNotAssigned: [],
  foundAssigned: [],
};

const TestImport = ({ importedDevices }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(initialResults);

  const [percentTreated, setPercentTreated] = useState(0);

  const getDevice = (device) => {
    const deviceResult = {
      found: false,
      alreadyAssigned: false,
    };

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    return axiosInstance
      .get(`${endpoints.owprov}/api/v1/inventory/${device.SerialNumber}`, options)
      .then((response) => {
        deviceResult.found = true;
        if (response.data.venue !== '' || response.data.entity !== '') {
          deviceResult.alreadyAssigned(true);
        }
      })
      .catch(() => deviceResult);
  };

  const testImport = async () => {
    setResults(initialResults);
    setLoading(true);

    // Result arrays
    const good = [];
    const foundNotAssigned = [];
    const foundAssigned = [];

    const numberOfDevices = importedDevices.length;
    for (let i = 0; i < numberOfDevices; i += 1) {
      const device = importedDevices[i];
      // eslint-disable-next-line no-await-in-loop
      const result = await getDevice(device);

      if (result.found) {
        if (result.alreadyAssigned) {
          foundAssigned.push(device);
        } else {
          foundNotAssigned.push(device);
        }
      } else {
        good.push(device);
      }
      setPercentTreated(Math.floor((i / numberOfDevices) * 100));
    }

    setResults({
      good,
      foundNotAssigned,
      foundAssigned,
    });

    setLoading(false);
  };

  useEffect(() => {
    if (importedDevices.length > 0) testImport();
  }, [importedDevices]);

  if (loading) {
    return (
      <div>
        <CRow className="py-2">
          <CCol className="text-center">
            <CSpinner />
          </CCol>
        </CRow>
        <CRow className="py-2">
          <CCol className="text-center">
            <CProgress height={20} className="mb-3">
              <CProgressBar value={percentTreated} animated />
            </CProgress>
          </CCol>
        </CRow>
      </div>
    );
  }
  return (
    <CRow className="py-2">
      <CCol>
        <h5 className="pb-3">{t('inventory.test_results')}</h5>
        <TestResults results={results} />
      </CCol>
    </CRow>
  );
};

TestImport.propTypes = {
  importedDevices: PropTypes.instanceOf(Array),
};

TestImport.defaultProps = {
  importedDevices: [],
};

export default TestImport;
