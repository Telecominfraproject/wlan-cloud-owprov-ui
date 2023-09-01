import * as React from 'react';
import { Heading, List, ListItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import { VenueStatsDisplay } from './VenueStatsDisplay';

type DeviceTypeEntry = {
  deviceType: string;
  amount: number;
};

const DeviceTypesCard = () => {
  const { t } = useTranslation();
  const { dashboard, handleDashboardModalOpen } = useVenueMonitoring();

  const getTopDeviceTypes = () => {
    const orderedTotals = Object.keys(dashboard.deviceTypeTotals)
      .map((k) => ({
        deviceType: k,
        amount: dashboard.deviceTypeTotals[k] as number,
      }))
      .sort((a, b) => (a.amount < b.amount ? 1 : -1));

    if (orderedTotals.length <= 3) {
      return orderedTotals;
    }

    let othersTotal = 0;
    for (let i = 2; i < orderedTotals.length; i += 1) {
      othersTotal += (orderedTotals[i] as DeviceTypeEntry).amount;
    }

    return [
      orderedTotals[0] as DeviceTypeEntry,
      orderedTotals[1] as DeviceTypeEntry,
      { deviceType: 'Others', amount: othersTotal },
    ];
  };

  return (
    <VenueStatsDisplay
      title={t('analytics.device_types')}
      explanation={t('analytics.device_types_explanation')}
      element={
        <Heading size="sm">
          <List>
            {getTopDeviceTypes().map(({ deviceType, amount }) => (
              <ListItem key={uuid()}>
                {deviceType}: {amount}
              </ListItem>
            ))}
          </List>
        </Heading>
      }
      openModal={() =>
        handleDashboardModalOpen({
          prioritizedColumns: ['deviceType'],
          sortBy: [
            {
              id: 'deviceType',
              desc: false,
            },
          ],
        })
      }
    />
  );
};

export default DeviceTypesCard;
