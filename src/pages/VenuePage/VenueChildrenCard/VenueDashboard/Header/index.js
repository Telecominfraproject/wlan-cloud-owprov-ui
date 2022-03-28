import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Heading, List, ListItem, Text } from '@chakra-ui/react';
import SimpleStatDisplay from 'components/StatisticsDisplay/SimpleStatDisplay';
import { minimalSecondsToDetailed } from 'utils/dateFormatting';
import { Circle } from 'phosphor-react';
import Masonry from 'react-masonry-css';
import HealthStat from './HealthStat';
import FirmwareStat from './FirmwareStat';
import DeviceTypeStat from './DeviceTypeStat';
import MemoryStat from './MemoryStat';

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
        default: 4,
        1400: 3,
        1100: 2,
        600: 1,
      }}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      <SimpleStatDisplay
        title={t('common.status')}
        explanation={t('analytics.total_devices_explanation', {
          connectedCount: data.connectedDevices,
          disconnectedCount: data.disconnectedDevices,
        })}
        element={
          <Heading size="sm" display="flex">
            <List>
              <ListItem display="flex">
                <Circle size={20} color="var(--chakra-colors-green-400)" weight="fill" />
                <Text mt="2px" ml={1} mr={4}>
                  {`${data.connectedDevices} ${t('analytics.connected')}`}
                </Text>
              </ListItem>
              <ListItem display="flex">
                <Circle size={20} color="var(--chakra-colors-red-400)" weight="fill" />
                <Text mt="2px" ml={1} mr={2}>
                  {data.disconnectedDevices} {t('analytics.disconnected')}
                </Text>
              </ListItem>
            </List>
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
      <MemoryStat data={data} handleModalClick={handleModalClick} />
      <DeviceTypeStat data={data} handleModalClick={handleModalClick} />
      <FirmwareStat data={data} handleModalClick={handleModalClick} />
      <SimpleStatDisplay
        title={t('analytics.average_uptime')}
        label={minimalSecondsToDetailed(data.avgUptime, t)}
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
        title={t('analytics.associations')}
        element={
          <Heading size="sm">
            <List>
              <ListItem>{data.twoGAssociations} 2G</ListItem>
              <ListItem>{data.fiveGAssociations} 5G</ListItem>
              <ListItem>{data.sixGAssociations} 6G</ListItem>
            </List>
          </Heading>
        }
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
