import * as React from 'react';
import { Heading, List, ListItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import { VenueStatsDisplay } from './VenueStatsDisplay';

const FirmwareDistributionCard = () => {
  const { t } = useTranslation();
  const { dashboard, handleDashboardModalOpen } = useVenueMonitoring();

  const getTopFirmware = () => {
    const orderedTotals = Object.keys(dashboard.deviceFirmwareTotals)
      .map((k) => ({
        lastFirmware: k,
        amount: dashboard.deviceFirmwareTotals[k] as number,
      }))
      .sort((a, b) => (a.amount < b.amount ? 1 : -1));

    if (orderedTotals.length <= 3) {
      return orderedTotals;
    }

    let othersTotal = 0;
    for (let i = 3; i < orderedTotals.length; i += 1) {
      othersTotal += (orderedTotals[i] as { lastFirmware: string; amount: number }).amount;
    }

    return [
      orderedTotals[0] as { lastFirmware: string; amount: number },
      orderedTotals[1] as { lastFirmware: string; amount: number },
      { lastFirmware: 'Others', amount: othersTotal },
    ];
  };

  return (
    <VenueStatsDisplay
      title={t('analytics.firmware')}
      explanation={t('analytics.last_firmware_explanation')}
      element={
        <Heading size="sm">
          <List>
            {getTopFirmware().map(({ lastFirmware, amount }) => (
              <ListItem key={uuid()}>
                {lastFirmware}: {amount}
              </ListItem>
            ))}
          </List>
        </Heading>
      }
      openModal={() =>
        handleDashboardModalOpen({
          prioritizedColumns: ['lastFirmware'],
          sortBy: [
            {
              id: 'lastFirmware',
              desc: false,
            },
          ],
        })
      }
    />
  );
};

export default FirmwareDistributionCard;
