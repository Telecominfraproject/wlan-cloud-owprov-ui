import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Box, Center, Heading, List, ListItem, Progress, Spinner } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'contexts/AuthProvider';
import { axiosProv } from 'utils/axiosInstances';
import PushResultTable from './PushResultTable';

const propTypes = {
  devices: PropTypes.shape({
    newDevices: PropTypes.instanceOf(Array).isRequired,
    devicesToUpdate: PropTypes.instanceOf(Array).isRequired,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
  deviceClass: PropTypes.string.isRequired,
  parent: PropTypes.instanceOf(Object).isRequired,
  setIsCloseable: PropTypes.func.isRequired,
};

const ImportDevicePush = ({ devices, refresh, deviceClass, parent, setIsCloseable }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [results, setResults] = useState({ isLoading: false });

  const createDevice = (device, source) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cancelToken: source.token,
    };

    return axios
      .post(`${axiosProv.defaults.baseURL}/inventory/${device.serialNumber}`, device, options)
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
        Authorization: `Bearer ${token}`,
      },
      cancelToken: source.token,
    };

    return axios
      .put(`${axiosProv.defaults.baseURL}/inventory/${device.serialNumber}`, device, options)
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
    setResults({ isLoading: true });

    const commonInfo = {
      entity: '',
      venue: '',
      subscriber: '',
      devClass: deviceClass,
      ...parent,
    };

    const totalLength = devices.newDevices.length + devices.devicesToUpdate;
    const successPost = [];
    const errorPost = [];
    const successPut = [];
    const errorPut = [];

    for (let i = 0; i < devices.newDevices.length; i += 1) {
      const device = devices.newDevices[i];

      setResults({
        isLoading: true,
        treating: device.SerialNumber,
        percentTreated: Math.floor((Math.max(i - 1, 0) / totalLength) * 100),
      });

      const deviceToPush = {
        ...commonInfo,
        serialNumber: device.SerialNumber,
        deviceType: device.DeviceType,
        name: device.Name.length > 0 ? device.Name : device.SerialNumber,
        description: device.Description,
        notes: device.Note !== '' ? [{ note: device.Note }] : undefined,
      };

      // eslint-disable-next-line no-await-in-loop
      const result = await createDevice(deviceToPush, source);
      if (result.stop) break;
      if (result.success) successPost.push(device);
      else if (!result.success) errorPost.push({ ...device, error: result.error });
    }

    for (let i = 0; i < devices.devicesToUpdate.length; i += 1) {
      const device = devices.devicesToUpdate[i];

      setResults({
        isLoading: true,
        treating: device.SerialNumber,
        percentTreated: Math.floor((Math.max(i - 1, 0) / totalLength) * 100),
      });

      const deviceToPush = {
        ...commonInfo,
        serialNumber: device.SerialNumber,
        name: device.Name.length > 0 ? device.Name : device.SerialNumber,
        description: device.Description,
        notes: device.Note !== '' ? [{ note: device.Note }] : undefined,
      };

      // eslint-disable-next-line no-await-in-loop
      const result = await updateDevice(deviceToPush, source);
      if (result.stop) break;
      if (result.success) successPut.push(device);
      else if (!result.success) errorPut.push({ ...device, error: result.error });
    }

    setResults({
      isLoading: false,
      isFinished: true,
      successPost,
      errorPost,
      successPut,
      errorPut,
    });
    setIsCloseable(true);
    refresh();
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    if (devices?.newDevices?.length > 0 || devices?.devicesToUpdate?.length > 0) {
      importDevices(source);
    }
    return () => {
      source.cancel('axios request cancelled');
    };
  }, [devices]);

  if (results?.isLoading) {
    return (
      <Box>
        <Center my={2}>
          <Spinner size="xl" />
        </Center>
        <Progress hasStripe size="lg" isAnimated value={results?.percentTreated ?? 0} />
        <Heading my={2} size="md">
          {t('devices.treating')}: {results?.treating}
        </Heading>
      </Box>
    );
  }

  if (results?.isFinished) {
    return (
      <List>
        {results.successPost.length > 0 && (
          <Box border="2px" borderRadius="5px" borderColor="green.400" px={1}>
            <ListItem fontWeight="bold">
              {results.successPost.length} {t('devices.create_success')}
            </ListItem>
            <PushResultTable devices={results.successPost} />
          </Box>
        )}
        {results.errorPost.length > 0 && (
          <Box border="2px" borderRadius="5px" borderColor="red.400" mt={2} px={1}>
            <ListItem fontWeight="bold">
              {results.errorPost.length} {t('devices.create_errors')}
            </ListItem>
            <PushResultTable devices={results.errorPost} isShowingError />
          </Box>
        )}
        {results.successPut.length > 0 && (
          <Box border="2px" borderRadius="5px" borderColor="green.400" mt={2} px={1}>
            <ListItem fontWeight="bold">
              {results.successPut.length} {t('devices.update_success')}
            </ListItem>
            <PushResultTable devices={results.successPut} />
          </Box>
        )}
        {results.errorPut.length > 0 && (
          <Box border="2px" borderRadius="5px" borderColor="red.400" mt={2} px={1}>
            <ListItem fontWeight="bold">
              {results.errorPut.length} {t('devices.update_error')}
            </ListItem>
            <PushResultTable devices={results.errorPut} isShowingError />
          </Box>
        )}
      </List>
    );
  }

  return null;
};

ImportDevicePush.propTypes = propTypes;
export default ImportDevicePush;
