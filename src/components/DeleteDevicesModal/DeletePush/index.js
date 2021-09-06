import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CSpinner, CProgress, CProgressBar, CRow, CCol } from '@coreui/react';
import axios from 'axios';
import axiosInstance from 'utils/axiosInstance';
import { useAuth } from 'ucentral-libs';
import FinalDeleteResults from './FinalDeleteResults';

const initialResults = {
  deleteSuccess: [],
  deleteUnassignSuccess: [],
  errors: [],
};

const ImportPush = ({ groupedDevices, importChoices, refreshPageTables }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(initialResults);
  const [percentTreated, setPercentTreated] = useState(0);
  const [treating, setTreating] = useState('');

  const unassignDevice = (device, source) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      cancelToken: source.token,
    };

    return axiosInstance
      .put(
        `${endpoints.owprov}/api/v1/inventory/${device.SerialNumber}?unassign=true`,
        null,
        options,
      )
      .then(() => ({ success: true }))
      .catch((e) => {
        if (axios.isCancel(e)) return { success: false, stop: true };
        return {
          success: false,
          error: e.response?.data?.ErrorDescription ?? 'Unknown Error',
        };
      });
  };

  const deleteDevice = async (device, source, unassign) => {
    if (unassign) {
      const result = await unassignDevice(device, source);
      if (!result.success) return result;
    }

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      cancelToken: source.token,
    };

    return axiosInstance
      .delete(`${endpoints.owprov}/api/v1/inventory/${device.SerialNumber}`, options)
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
    const deleteSuccess = [];
    const deleteUnassignSuccess = [];
    const errors = [];

    // For loops
    const unassignedLength = groupedDevices.notAssigned.length;
    const assignedLength = groupedDevices.assigned.length;
    const numberOfDevices = unassignedLength + assignedLength;

    // Treating devices that only need to be deleted
    for (let i = 0; i < unassignedLength; i += 1) {
      const device = groupedDevices.notAssigned[i];
      setTreating(device.SerialNumber);
      // eslint-disable-next-line no-await-in-loop
      const result = await deleteDevice(device, source, false);
      if (result.stop) break;
      if (result.success) {
        deleteSuccess.push(device);
      } else {
        errors.push({ ...device, ...{ error: result.error } });
      }
      setPercentTreated(Math.floor((i / numberOfDevices) * 100));
    }

    // Treating devices which have to be unassigned and then deleted
    if (importChoices.unassign) {
      for (let i = 0; i < assignedLength; i += 1) {
        const device = groupedDevices.assigned[i];
        setTreating(device.SerialNumber);
        // eslint-disable-next-line no-await-in-loop
        const result = await deleteDevice(device, source, true);
        if (result.stop) break;
        if (result.success) {
          deleteUnassignSuccess.push(device);
        } else {
          errors.push({ ...device, ...{ error: result.error } });
        }
        setPercentTreated(Math.floor((i / numberOfDevices) * 100));
      }
    }

    setResults({
      deleteSuccess,
      deleteUnassignSuccess,
      errors,
    });

    setLoading(false);
    if (refreshPageTables !== null) refreshPageTables();
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    if (
      groupedDevices.notAssigned.length > 0 ||
      (groupedDevices.assigned.length > 0 && importChoices.unassign)
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
              {t('inventory.deleting')} {treating}
            </h6>
          </CCol>
        </CRow>
        <CRow className="py-2">
          <CCol className="text-center">
            <CProgress height={20} className="mb-3">
              <CProgressBar value={percentTreated} animated>
                {percentTreated}% {t('inventory.devices_deleted')}
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
          <h5 className="pb-3">{t('inventory.final_delete_results')}</h5>
          <FinalDeleteResults results={results} />
        </CCol>
      </CRow>
    </div>
  );
};

ImportPush.propTypes = {
  groupedDevices: PropTypes.instanceOf(Object).isRequired,
  importChoices: PropTypes.instanceOf(Object).isRequired,
  refreshPageTables: PropTypes.func,
};

ImportPush.defaultProps = {
  refreshPageTables: null,
};

export default ImportPush;
