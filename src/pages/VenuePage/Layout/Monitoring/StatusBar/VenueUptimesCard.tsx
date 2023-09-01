import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import { VenueStatsDisplay } from './VenueStatsDisplay';
import { minimalSecondsToDetailed } from 'utils/dateFormatting';

const VenueUptimesCard = () => {
  const { t } = useTranslation();
  const { dashboard, handleDashboardModalOpen } = useVenueMonitoring();

  return (
    <VenueStatsDisplay
      title={t('analytics.average_uptime')}
      label={minimalSecondsToDetailed(dashboard.avgUptime, t)}
      explanation={t('analytics.average_uptime_explanation')}
      openModal={() =>
        handleDashboardModalOpen({
          prioritizedColumns: ['uptime', 'lastPing'],
          sortBy: [
            {
              id: 'uptime',
              desc: true,
            },
          ],
        })
      }
    />
  );
};

export default VenueUptimesCard;
