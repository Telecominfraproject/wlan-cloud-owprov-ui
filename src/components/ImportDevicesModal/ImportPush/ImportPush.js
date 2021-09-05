import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CSpinner, CProgress, CProgressBar, CRow, CCol } from '@coreui/react';
import axios from 'axios';
import axiosInstance from 'utils/axiosInstance';
import { useAuth } from 'ucentral-libs';
import FinalImportResults from './FinalImportResults';

const initialResults = {
  creationSuccess: [],
  updateSuccess: [],
  creationErrors: [],
  updateErrors: [],
};

const ImportPush = ({ entity, groupedDevices, importChoices, refreshPageTables }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(initialResults);
  const [percentTreated, setPercentTreated] = useState(0);
  const [treating, setTreating] = useState('');

  const createDevice = (device, source) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      cancelToken: source.token,
    };

    const parameters = {
      entity: !entity?.isVenue && entity?.uuid ? entity.uuid : undefined,
      venue: entity?.isVenue && entity?.uuid ? entity.uuid : undefined,
      serialNumber: device.SerialNumber,
      name: device.Name !== '' ? device.Name : device.SerialNumber,
      deviceType: device.DeviceType,
      description: device.Description,
      notes: device.NoteText !== '' ? [{ note: device.NoteText }] : undefined,
    };

    return axiosInstance
      .post(`${endpoints.owprov}/api/v1/inventory/1`, parameters, options)
      .then(() => ({ success: true }))
      .catch((e) => {
        if (axios.isCancel(e)) return { success: false, stop: true };
        return {
          success: false,
          error: e.response?.data?.ErrorDescription ?? 'Unknown Error',
        };
      });
  };

  const updateDevice = (device, source) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      cancelToken: source.token,
    };

    const parameters = {
      entity: !entity?.isVenue && entity?.uuid ? entity.uuid : undefined,
      venue: entity?.isVenue && entity?.uuid ? entity.uuid : undefined,
      name: device.Name !== '' ? device.Name : device.SerialNumber,
      deviceType: device.DeviceType,
      description: device.Description,
      notes: device.NoteText !== '' ? [{ note: device.NoteText }] : undefined,
    };

    return axiosInstance
      .put(`${endpoints.owprov}/api/v1/inventory/${device.SerialNumber}`, parameters, options)
      .then(() => ({ success: true }))
      .catch((e) => {
        if (axios.isCancel(e)) return { success: false, stop: true };
        return {
          success: false,
          error: e.response?.data?.ErrorDescription ?? 'Unknown Error',
        };
      });
  };

  const importDevices = async (source) => {
    setResults(initialResults);
    setLoading(true);

    // Result arrays
    const creationSuccess = [];
    const updateSuccess = [];
    const creationErrors = [];
    const updateErrors = [];
    const goodLength = groupedDevices.good.length;
    const foundNotAssignedLength = importChoices.assignUnassigned
      ? groupedDevices.foundNotAssigned.length
      : 0;
    const foundAssignedLength = importChoices.reassign ? groupedDevices.foundAssigned.length : 0;
    const numberOfDevices = goodLength + foundNotAssignedLength + foundAssignedLength;

    // Treating devices that do not exist yet (only a POST)
    for (let i = 0; i < goodLength; i += 1) {
      const device = groupedDevices.good[i];
      setTreating(device.SerialNumber);
      // eslint-disable-next-line no-await-in-loop
      const result = await createDevice(device, source);
      if (result.stop) break;
      if (result.success) {
        creationSuccess.push(device);
      } else {
        creationErrors.push({ ...device, ...{ error: result.error } });
      }
      setPercentTreated(Math.floor((i / numberOfDevices) * 100));
    }

    // Treating devices which exist but were not assigned, if user chose so
    if (importChoices.assignUnassigned) {
      for (let i = 0; i < foundNotAssignedLength; i += 1) {
        const device = groupedDevices.foundNotAssigned[i];
        setTreating(device.SerialNumber);
        // eslint-disable-next-line no-await-in-loop
        const result = await updateDevice(device, source);
        if (result.stop) break;
        if (result.success) {
          updateSuccess.push(device);
        } else {
          updateErrors.push({ ...device, ...{ error: result.error } });
        }
        setPercentTreated(Math.floor((i / numberOfDevices) * 100));
      }
    }

    // Treating devices which exist and are assigned, if user chose so
    if (importChoices.reassign) {
      for (let i = 0; i < foundAssignedLength; i += 1) {
        const device = groupedDevices.foundAssigned[i];
        setTreating(device.SerialNumber);
        // eslint-disable-next-line no-await-in-loop
        const result = await updateDevice(device, source);
        if (result.stop) break;
        if (result.success) {
          updateSuccess.push(device);
        } else {
          updateErrors.push({ ...device, ...{ error: result.error } });
        }
        setPercentTreated(Math.floor((i / numberOfDevices) * 100));
      }
    }

    setResults({
      creationSuccess,
      updateSuccess,
      creationErrors,
      updateErrors,
    });
    setLoading(false);
    if (refreshPageTables !== null) refreshPageTables();
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    if (
      (groupedDevices.good.length > 0 ||
        groupedDevices.foundNotAssigned.length > 0 ||
        groupedDevices.foundAssigned.length > 0) &&
      importChoices.reassign !== undefined &&
      importChoices.assignUnassigned !== undefined
    ) {
      importDevices(source);
    }
    return () => {
      source.cancel('axios request cancelled');
    };
  }, [groupedDevices, importChoices]);

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
              {t('inventory.importing')} {treating}
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
          <h5 className="pb-3">{t('inventory.final_import_results')}</h5>
          <FinalImportResults results={results} />
        </CCol>
      </CRow>
    </div>
  );
};

ImportPush.propTypes = {
  entity: PropTypes.instanceOf(Object).isRequired,
  groupedDevices: PropTypes.instanceOf(Object).isRequired,
  importChoices: PropTypes.instanceOf(Object).isRequired,
  refreshPageTables: PropTypes.func,
};

ImportPush.defaultProps = {
  refreshPageTables: null,
};

export default ImportPush;
