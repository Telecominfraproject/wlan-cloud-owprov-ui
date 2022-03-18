import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SimpleGrid } from '@chakra-ui/react';
import SimpleStatDisplay from 'components/StatisticsDisplay/SimpleStatDisplay';
import { minimalSecondsToDetailed } from 'utils/dateFormatting';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  openModal: PropTypes.func.isRequired,
};

const VenueAnalyticsHeader = ({ data, openModal }) => {
  const { t } = useTranslation();

  const handleModalClick = (tableOptions) => () => openModal(tableOptions);

  return (
    <SimpleGrid minChildWidth="340px" spacing="20px">
      <SimpleStatDisplay
        label={`${t('analytics.total_devices', { count: data.totalDevices })}, ${t('analytics.connection_percentage', {
          count: data.connectedPercentage,
        })}`}
        explanation={t('analytics.total_devices_explanation', {
          connectedCount: data.connectedDevices,
          disconnectedCount: data.disconnectedDevices,
        })}
        openModal={handleModalClick({
          prioritizedColumns: ['connected'],
          sortBy: [
            {
              id: 'connected',
              desc: 'true',
            },
          ],
        })}
      />
      <SimpleStatDisplay
        label={t('analytics.average_health', { count: data.avgHealth })}
        explanation={t('analytics.average_health_explanation')}
        openModal={handleModalClick({
          prioritizedColumns: ['health', 'lastHealth'],
          sortBy: [
            {
              id: 'health',
            },
          ],
        })}
      />
      <SimpleStatDisplay
        label={t('analytics.average_memory', { count: data.avgMemoryUsed })}
        explanation={t('analytics.average_memory_explanation')}
        openModal={handleModalClick({
          prioritizedColumns: ['memory', 'lastPing'],
          sortBy: [
            {
              id: 'memory',
              desc: 'true',
            },
          ],
        })}
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
        openModal={handleModalClick({
          prioritizedColumns: ['2g', '5g', '6g'],
          sortBy: [
            {
              id: '2g',
              desc: 'true',
            },
            {
              id: '5g',
              desc: 'true',
            },
            {
              id: '6g',
              desc: 'true',
            },
          ],
        })}
      />
    </SimpleGrid>
  );
};

VenueAnalyticsHeader.propTypes = propTypes;
export default VenueAnalyticsHeader;
