import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Heading, Text, Tooltip } from '@chakra-ui/react';
import SimpleStatDisplay from 'components/StatisticsDisplay/SimpleStatDisplay';
import { minimalSecondsToDetailed } from 'utils/dateFormatting';
import { InfoIcon } from '@chakra-ui/icons';
import { Circle } from 'phosphor-react';
import Masonry from 'react-masonry-css';
import HealthStat from './HealthStat';
import FirmwareStat from './FirmwareStat';
import DeviceTypeStat from './DeviceTypeStat';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  openModal: PropTypes.func.isRequired,
};

const VenueAnalyticsHeader = ({ data, openModal }) => {
  const { t } = useTranslation();

  const handleModalClick = (tableOptions) => () => openModal(tableOptions);

  return (
    <Masonry
      breakpointCols={{
        default: 3,
        1400: 2,
        1100: 1,
      }}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      <SimpleStatDisplay
        element={
          <Heading size="md" display="flex">
            <Text mt="2px" mr={2}>
              {t('analytics.total_devices', { count: data.totalDevices })}
            </Text>
            <Circle size={28} color="var(--chakra-colors-green-400)" weight="fill" />
            <Text mt="2px" ml={1} mr={4}>
              {data.connectedDevices}
            </Text>
            <Circle size={28} color="var(--chakra-colors-red-400)" weight="fill" />
            <Text mt="2px" ml={1} mr={2}>
              {data.disconnectedDevices}
            </Text>
            <Tooltip
              hasArrow
              label={t('analytics.total_devices_explanation', {
                connectedCount: data.connectedDevices,
                disconnectedCount: data.disconnectedDevices,
              })}
            >
              <InfoIcon ml={2} mt="4px" />
            </Tooltip>
          </Heading>
        }
        openModal={handleModalClick({
          prioritizedColumns: ['connected'],
          sortBy: [
            {
              id: 'connected',
              desc: true,
            },
          ],
        })}
        mb={4}
      />
      <HealthStat data={data} handleModalClick={handleModalClick} />
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
        mb={4}
      />
      <DeviceTypeStat data={data} handleModalClick={handleModalClick} />
      <FirmwareStat data={data} handleModalClick={handleModalClick} />
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
        mb={4}
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
        mb={4}
      />
    </Masonry>
  );
};

VenueAnalyticsHeader.propTypes = propTypes;
export default VenueAnalyticsHeader;
