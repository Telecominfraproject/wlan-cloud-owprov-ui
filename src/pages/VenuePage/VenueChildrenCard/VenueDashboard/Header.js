import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SimpleGrid } from '@chakra-ui/react';
import SimpleStatDisplay from 'components/StatisticsDisplay/SimpleStatDisplay';
import { minimalSecondsToDetailed } from 'utils/dateFormatting';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};

const VenueAnalyticsHeader = ({ data }) => {
  const { t } = useTranslation();

  return (
    <SimpleGrid minChildWidth="300px" spacing="20px">
      <SimpleStatDisplay
        label={t('analytics.total_devices', { count: data.totalDevices })}
        explanation={t('analytics.total_devices_explanation', {
          connectedCount: data.connectedDevices,
          disconnectedCount: data.disconnectedDevices,
        })}
      />
      <SimpleStatDisplay
        label={t('analytics.connection_percentage', { count: data.connectedPercentage })}
        explanation={t('analytics.connection_percentage_explanation', {
          connectedCount: data.connectedDevices,
          disconnectedCount: data.disconnectedDevices,
        })}
      />
      <SimpleStatDisplay
        label={t('analytics.average_health', { count: data.avgHealth })}
        explanation={t('analytics.average_health_explanation')}
      />
      <SimpleStatDisplay
        label={t('analytics.average_memory', { count: data.avgMemoryUsed })}
        explanation={t('analytics.average_memory_explanation')}
      />
      <SimpleStatDisplay
        label={t('analytics.average_uptime', { uptime: minimalSecondsToDetailed(data.avgUptime, t) })}
        explanation={t('analytics.average_uptime_explanation')}
      />
      <SimpleStatDisplay
        label={t('analytics.associations', {
          twoG: data.twoGAssociations,
          fiveG: data.fiveGAssociations,
          sixG: data.sixGAssociations,
        })}
        explanation={t('analytics.associations_explanation')}
      />
    </SimpleGrid>
  );
};

VenueAnalyticsHeader.propTypes = propTypes;
export default VenueAnalyticsHeader;
