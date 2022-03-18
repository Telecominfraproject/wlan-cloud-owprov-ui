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

  const getTopDeviceTypes = () => {
    const orderedTotals = Object.keys(data.deviceTypeTotals)
      .map((k) => ({
        deviceType: k,
        amount: data.deviceTypeTotals[k],
      }))
      .sort((a, b) => (a.amount < b.amount ? 1 : -1));

    if (orderedTotals.length <= 3) {
      return orderedTotals.map((v) => `${v.amount} ${v.deviceType}`).join(', ');
    }

    let othersTotal = 0;
    for (let i = 3; i < orderedTotals.length; i += 1) {
      othersTotal += orderedTotals[i].amount;
    }

    return `${orderedTotals[0].amount} ${orderedTotals[0].deviceType}, ${orderedTotals[1].amount} ${
      orderedTotals[1].deviceType
    }, ${othersTotal} ${t('common.others')}`;
  };

  const getTopFirmware = () => {
    const orderedTotals = Object.keys(data.deviceFirmwareTotals)
      .map((k) => ({
        lastFirmware: k,
        amount: data.deviceFirmwareTotals[k],
      }))
      .sort((a, b) => (a.amount < b.amount ? 1 : -1));

    if (orderedTotals.length <= 3) {
      return orderedTotals.map((v) => `${v.amount} ${v.lastFirmware}`).join(', ');
    }

    let othersTotal = 0;
    for (let i = 3; i < orderedTotals.length; i += 1) {
      othersTotal += orderedTotals[i].amount;
    }

    return `${orderedTotals[0].amount} ${orderedTotals[0].lastFirmware}, ${orderedTotals[1].amount} ${
      orderedTotals[1].lastFirmware
    }, ${othersTotal} ${t('common.others')}`;
  };

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
              desc: true,
            },
          ],
        })}
      />
      <SimpleStatDisplay
        label={t('analytics.average_health', { count: data.avgHealth })}
        explanation={t('analytics.average_health_explanation')}
        openModal={handleModalClick({
          prioritizedColumns: ['lastHealth', 'health'],
          sortBy: [
            {
              id: 'health',
              desc: false,
            },
          ],
        })}
      />
      <SimpleStatDisplay
        label={t('analytics.average_memory', { count: data.avgMemoryUsed })}
        explanation={t('analytics.average_memory_explanation')}
        openModal={handleModalClick({
          prioritizedColumns: ['lastPing', 'memory'],
          sortBy: [
            {
              id: 'memory',
              desc: true,
            },
          ],
        })}
      />
      <SimpleStatDisplay
        label={t('analytics.average_uptime', { uptime: minimalSecondsToDetailed(data.avgUptime, t) })}
        explanation={t('analytics.average_uptime_explanation')}
        openModal={handleModalClick({
          prioritizedColumns: ['uptime', 'lastPing'],
          sortBy: [
            {
              id: 'uptime',
              desc: true,
            },
          ],
        })}
      />
      <SimpleStatDisplay
        label={t('analytics.associations', {
          twoG: data.twoGAssociations,
          fiveG: data.fiveGAssociations,
          sixG: data.sixGAssociations,
        })}
        explanation={t('analytics.associations_explanation')}
        openModal={handleModalClick({
          prioritizedColumns: ['6g', '5g', '2g'],
          sortBy: [
            {
              id: '2g',
              desc: true,
            },
            {
              id: '5g',
              desc: true,
            },
            {
              id: '6g',
              desc: true,
            },
          ],
        })}
      />
      <SimpleStatDisplay
        label={getTopDeviceTypes()}
        explanation={t('analytics.device_types_explanation')}
        openModal={handleModalClick({
          prioritizedColumns: ['deviceType'],
          sortBy: [
            {
              id: 'deviceType',
              desc: false,
            },
          ],
        })}
      />
      <SimpleStatDisplay
        label={getTopFirmware()}
        explanation={t('analytics.last_firmware_explanation')}
        openModal={handleModalClick({
          prioritizedColumns: ['lastFirmware'],
          sortBy: [
            {
              id: 'lastFirmware',
              desc: false,
            },
          ],
        })}
      />
    </SimpleGrid>
  );
};

VenueAnalyticsHeader.propTypes = propTypes;
export default VenueAnalyticsHeader;
