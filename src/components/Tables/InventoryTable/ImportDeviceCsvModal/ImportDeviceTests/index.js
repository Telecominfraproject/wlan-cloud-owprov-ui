import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useGetDeviceTypes from 'hooks/Network/DeviceTypes';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  List,
  ListItem,
  Progress,
  Spinner,
  Switch,
  useBoolean,
} from '@chakra-ui/react';
import { axiosProv } from 'utils/axiosInstances';
import { useAuth } from 'contexts/AuthProvider';
import TestResultTable from './TestResultTable';

const propTypes = {
  setPhase: PropTypes.func.isRequired,
  setDevicesToImport: PropTypes.func.isRequired,
  devicesToTest: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
};

const ImportDeviceTests = ({ devicesToTest, setPhase, setDevicesToImport }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { data: deviceTypes } = useGetDeviceTypes();
  const [reassign, { toggle: toggleReassign }] = useBoolean(false);
  const [assignUnassigned, { toggle: toggleAssignUnassigned }] = useBoolean(false);
  const [testResult, setTestResult] = useState({ isLoading: false });

  const getDevice = (device, axiosSource) => {
    const deviceResult = {
      found: false,
      alreadyAssigned: false,
    };

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cancelToken: axiosSource.token,
    };

    return axios
      .get(`${axiosProv.defaults.baseURL}/inventory/${device.SerialNumber}`, options)
      .then((response) => {
        if (response.data.venue !== '' || response.data.entity !== '' || response.data.subscriber !== '')
          deviceResult.alreadyAssigned = true;
        else deviceResult.foundUnassigned = true;
        return deviceResult;
      })
      .catch((e) => {
        if (axios.isCancel(e)) return { stop: true };
        return deviceResult;
      });
  };

  const testDevice = (device, alreadyTested) => {
    if (device.SerialNumber === '' || device.SerialNumber.length !== 12 || !device.SerialNumber.match('^[a-fA-F0-9]+$'))
      return t('devices.invalid_serial_number');
    if (!deviceTypes.find((devType) => devType === device.DeviceType)) return t('devices.device_type_not_found');
    if (alreadyTested.find((testedDevice) => device.SerialNumber === testedDevice))
      return t('devices.duplicate_serial');
    return null;
  };

  const testImport = async (source) => {
    setTestResult({ isLoading: true });

    const treatedSerialNumbers = [];

    const newDevices = [];
    const foundNotAssigned = [];
    const foundAssigned = [];
    const fileErrors = [];

    for (let i = 0; i < devicesToTest.length; i += 1) {
      const device = devicesToTest[i];
      setTestResult({
        isLoading: true,
        treating: device.SerialNumber,
        percentTreated: Math.floor((Math.max(i - 1, 0) / devicesToTest.length) * 100),
      });
      const testDeviceInfo = testDevice(device, treatedSerialNumbers);

      if (!testDeviceInfo) {
        // eslint-disable-next-line no-await-in-loop
        const result = await getDevice(device, source);
        if (result.stop) break;
        else if (result.alreadyAssigned) foundAssigned.push(device);
        else if (result.foundUnassigned) foundNotAssigned.push(device);
        else newDevices.push(device);
      } else {
        fileErrors.push({ ...device, error: testDeviceInfo });
      }
      treatedSerialNumbers.push(device.SerialNumber);
    }

    setTestResult({
      isLoading: false,
      isFinished: true,
      newDevices,
      foundNotAssigned,
      foundAssigned,
      fileErrors,
    });
  };

  const canImport = () => {
    const newLength = testResult?.newDevices?.length ?? -1;
    const unassignedLength = testResult?.foundNotAssigned?.length ?? -1;
    const assignedLength = testResult?.foundAssigned?.length ?? -1;
    return newLength > 0 || (unassignedLength > 0 && assignUnassigned) || (assignedLength > 0 && reassign);
  };

  const startImport = () => {
    const assigned = reassign ? testResult.foundAssigned : [];
    const notAssigned = assignUnassigned ? testResult.foundNotAssigned : [];

    setDevicesToImport({
      newDevices: testResult.newDevices,
      devicesToUpdate: [...assigned, ...notAssigned],
    });
    setPhase(2);
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    if (devicesToTest.length > 0) {
      testImport(source);
    }
    return () => {
      source.cancel('axios request cancelled');
    };
  }, [devicesToTest]);

  if (testResult?.isLoading) {
    return (
      <Box>
        <Center my={2}>
          <Spinner size="xl" />
        </Center>
        <Progress hasStripe size="lg" isAnimated value={testResult?.percentTreated ?? 0} />
        <Heading my={2} size="md">
          {t('devices.treating')}: {testResult?.treating}
        </Heading>
      </Box>
    );
  }

  if (testResult?.isFinished) {
    return (
      <Box>
        <Heading size="md" mb={2}>
          {t('devices.test_results')}
        </Heading>
        <List>
          {testResult.newDevices.length > 0 && (
            <Box border="2px" borderRadius="5px" borderColor="green.400" px={1}>
              <ListItem fontWeight="bold">
                {testResult.newDevices.length} {t('devices.new_devices')}
              </ListItem>
              <TestResultTable devices={testResult.newDevices} />
            </Box>
          )}
          {testResult.foundNotAssigned.length > 0 && (
            <Box border="2px" borderRadius="5px" borderColor="yellow.400" mt={2} px={1}>
              <ListItem fontWeight="bold">
                {testResult.foundNotAssigned.length} {t('devices.found_not_assigned')}
              </ListItem>
              <TestResultTable devices={testResult.foundNotAssigned} />
            </Box>
          )}
          {testResult.foundAssigned.length > 0 && (
            <Box border="2px" borderRadius="5px" borderColor="yellow.400" mt={2} px={1}>
              <ListItem fontWeight="bold">
                {testResult.foundAssigned.length} {t('devices.found_assigned')}
              </ListItem>
              <TestResultTable devices={testResult.foundAssigned} />
            </Box>
          )}
          {testResult.fileErrors.length > 0 && (
            <Box border="2px" borderRadius="5px" borderColor="red.400" mt={2} px={1}>
              <ListItem fontWeight="bold">
                {testResult.fileErrors.length} {t('devices.file_errors')}
              </ListItem>
              <TestResultTable devices={testResult.fileErrors} isShowingError />
            </Box>
          )}
        </List>
        {testResult.foundNotAssigned.length > 0 && (
          <FormControl mt={4}>
            <FormLabel fontWeight="bold">{t('devices.assign_already_created')}</FormLabel>
            <Switch size="lg" isChecked={assignUnassigned} onChange={toggleAssignUnassigned} />
          </FormControl>
        )}
        {testResult.foundAssigned.length > 0 && (
          <FormControl mt={4}>
            <FormLabel fontWeight="bold">{t('devices.reassign_already_owned')}</FormLabel>
            <Switch size="lg" isChecked={reassign} onChange={toggleReassign} />
          </FormControl>
        )}
        <Center mt={6}>
          <Button mb={4} isDisabled={!canImport()} onClick={startImport}>
            {t('devices.start_import')}
          </Button>
        </Center>
      </Box>
    );
  }

  return null;
};

ImportDeviceTests.propTypes = propTypes;
export default ImportDeviceTests;
