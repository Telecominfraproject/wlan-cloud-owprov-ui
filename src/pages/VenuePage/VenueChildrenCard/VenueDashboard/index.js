import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useGetAnalyticsBoardDevices } from 'hooks/Network/Analytics';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';

const propTypes = {
  boardId: PropTypes.string.isRequired,
};

const VenueDashboard = ({ boardId }) => {
  const { t } = useTranslation();
  const toast = useToast();

  const { data: devices } = useGetAnalyticsBoardDevices({ t, toast, id: boardId });

  const parsedData = useMemo(() => {
    if (!devices) return {};

    const finalData = {
      totalDevices: devices.length,
      connectedDevices: 0,
      disconnectedDevices: 0,
      // avgMemoryUsed: 0, TODO
      avgHealth: 0,
      // avgUptime: 0, // TODO
      twoGAssociations: 0,
      fiveGAssociations: 0,
      sixGAssociations: 0,
      deviceTypeTotals: {},
      deviceFirmwareTotals: {},
      devices,
    };

    // Temporary values
    let totalHealth = 0;

    for (let i = 0; i < devices.length; i += 1) {
      const device = devices[i];

      if (finalData.deviceFirmwareTotals[device.lastFirmware]) finalData.deviceFirmwareTotals[device.lastFirmware] += 1;
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
    }

    finalData.avgHealth = Math.floor(totalHealth / finalData.totalDevices);

    return finalData;
  }, [devices]);
  return <pre>{JSON.stringify(parsedData, null, 4)}</pre>;
};

VenueDashboard.propTypes = propTypes;
export default VenueDashboard;
