/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import { Broadcast } from '@phosphor-icons/react';
import { SsidMonitoringData, expandIcon, noiseIcon, ueIcon } from '../utils';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import UeMonitoringNode from './UeMonitoringNode';

type Props = {
  data: SsidMonitoringData;
  level: number;
  expandedIds: {
    [key: string]: boolean;
  };
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
};

const SsidMonitoringNode = ({ data, level, expandedIds, onExpand, onCollapse }: Props) => {
  const { colorMode } = useColorMode();
  const context = useVenueMonitoring();
  const isSelected = context.selectedItem?.type === 'SSID' && context.selectedItem.data.bssid === data.bssid;
  const childrenLevel = level + 1;
  const isExpanded = expandedIds[`ssid-${data.bssid}`] === true;
  const ues = Object.values(data.ues).sort((a, b) => a.station.localeCompare(b.station));

  const onExpandClick = () => {
    if (isExpanded) {
      onCollapse(`ssid-${data.bssid}`);
    } else {
      onExpand(`ssid-${data.bssid}`);
    }
  };

  const onSelect = () => {
    context.onSelectItem({
      type: 'SSID',
      data,
    });
  };

  const selectedStyleProps = () =>
    isSelected
      ? {
          bg: colorMode === 'light' ? 'gray.100' : 'gray.600',
          fontWeight: 'bold',
          borderRadius: '10px',
        }
      : {};

  return (
    <Box mb={2}>
      <Flex alignItems="center">
        <span
          style={{
            width: '16px',
            cursor: 'pointer',
            paddingRight: '4px',
          }}
          onClick={ues.length > 0 ? onExpandClick : undefined}
        >
          {expandIcon(ues.length, isExpanded)}
        </span>
        <Flex cursor="pointer" w="100%" alignItems="center" onClick={onSelect} {...selectedStyleProps()}>
          <span
            style={{
              marginRight: '4px',
            }}
          >
            <Broadcast size={20} />
          </span>
          <Text>
            <pre>{data.ssid}</pre>
          </Text>
          {ueIcon(data.amountOfUes)}
          {noiseIcon(data.averageRssi)}
        </Flex>
      </Flex>

      {isExpanded ? (
        <Box paddingLeft={`${childrenLevel * 6}px`} pt={2}>
          {ues.map((ue) => (
            <UeMonitoringNode key={`ue-${ue.station}`} data={ue} />
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

export default SsidMonitoringNode;
