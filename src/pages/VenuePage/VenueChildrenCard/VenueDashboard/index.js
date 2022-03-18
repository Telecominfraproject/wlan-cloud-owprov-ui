import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useGetAnalyticsBoardDevices } from 'hooks/Network/Analytics';
import { useTranslation } from 'react-i18next';
import { Box, Center, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import LoadingOverlay from 'components/LoadingOverlay';
import RefreshButton from 'components/Buttons/RefreshButton';
import VenueAnalyticsHeader from './Header';
import VenueDashboardTableModal from './TableModal';

const propTypes = {
  boardId: PropTypes.string.isRequired,
};

const VenueDashboard = ({ boardId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(false);
  const [tableOptions, setTableOptions] = useState(null);

  const { data: devices, isFetching, refetch } = useGetAnalyticsBoardDevices({ t, toast, id: boardId });

  const openModal = (newOptions) => {
    setTableOptions(newOptions);
    onOpen();
  };

  const parsedData = useMemo(() => {
    if (!devices) return {};

    const finalData = {
      totalDevices: 0,
      connectedPercentage: 0,
      connectedDevices: 0,
      disconnectedDevices: 0,
      avgMemoryUsed: 0,
      avgHealth: 0,
      avgUptime: 0,
      twoGAssociations: 0,
      fiveGAssociations: 0,
      sixGAssociations: 0,
      deviceTypeTotals: {},
      deviceFirmwareTotals: {},
    };

    // Temporary values
    const finalDevices = [];
    const ignoredDevices = [];
    let totalHealth = 0;
    let totalUptime = 0;
    let totalMemory = 0;

    for (let i = 0; i < devices.length; i += 1) {
      const device = devices[i];
      if (device.deviceType !== '') {
        if (finalData.deviceFirmwareTotals[device.lastFirmware])
          finalData.deviceFirmwareTotals[device.lastFirmware] += 1;
        else finalData.deviceFirmwareTotals[device.lastFirmware] = 1;

        if (finalData.deviceTypeTotals[device.deviceType]) finalData.deviceTypeTotals[device.deviceType] += 1;
        else finalData.deviceTypeTotals[device.deviceType] = 1;

        if (device.associations_2g > 0) finalData.twoGAssocations += device.associations_2g;
        if (device.associations_5g > 0) finalData.fiveGAssocations += device.associations_2g;
        if (device.associations_6g > 0) finalData.sixGAssocations += device.associations_2g;

        if (device.connected) finalData.connectedDevices += 1;
        else finalData.disconnectedDevices += 1;

        // For averages to be calculated after the loop
        totalHealth += device.health;
        totalUptime += device.uptime;
        totalMemory += device.memory;

        finalDevices.push(device);
      } else {
        ignoredDevices.push(device);
        if (device.connected) finalData.connectedDevices += 1;
        else finalData.disconnectedDevices += 1;
      }
    }

    finalData.totalDevices = finalDevices.length + ignoredDevices.length;
    finalData.connectedPercentage = Math.floor(
      (finalData.connectedDevices / Math.max(1, finalData.totalDevices)) * 100,
    );
    finalData.devices = finalDevices;
    finalData.avgHealth = Math.floor(totalHealth / Math.max(1, finalData.connectedDevices));
    finalData.avgUptime = Math.floor(totalUptime / Math.max(1, finalData.connectedDevices));
    finalData.avgMemoryUsed = Math.floor(totalMemory / Math.max(1, finalData.connectedDevices));
    finalData.devices = finalDevices;
    finalData.ignoredDevices = ignoredDevices;
    return finalData;
  }, [devices]);

  return !devices ? (
    <Center mt={6}>
      <Spinner size="xl" />
    </Center>
  ) : (
    <LoadingOverlay isLoading={isFetching}>
      <Box>
        <Box textAlign="right" mb={4}>
          <VenueDashboardTableModal
            data={parsedData}
            tableOptions={tableOptions}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
          <RefreshButton onClick={refetch} isLoading={isFetching} ml={2} />
        </Box>
        <VenueAnalyticsHeader data={parsedData} openModal={openModal} />
      </Box>
    </LoadingOverlay>
  );
};

VenueDashboard.propTypes = propTypes;
export default VenueDashboard;
