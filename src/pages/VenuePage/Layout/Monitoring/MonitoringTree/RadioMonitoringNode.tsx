/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import { WifiHigh } from '@phosphor-icons/react';
import { RadioMonitoringData, expandIcon, noiseIcon, ueIcon } from '../utils';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import SsidMonitoringData from './SsidMonitoringNode';

type Props = {
  data: RadioMonitoringData;
  serialNumber: string;
  level: number;
  expandedIds: {
    [key: string]: boolean;
  };
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
};

const RadioMonitoringNode = ({ data, serialNumber, level, expandedIds, onExpand, onCollapse }: Props) => {
  const childrenLevel = level + 1;
  const { colorMode } = useColorMode();
  const context = useVenueMonitoring();
  const isSelected =
    context.selectedItem?.type === 'RADIO' &&
    context.selectedItem.data.band === data.band &&
    context.selectedItem.serialNumber === serialNumber;
  const isExpanded = expandedIds[`radio-${serialNumber}-${data.band}`] === true;
  const ssids = Object.values(data.ssids).sort((a, b) => a.ssid.localeCompare(b.ssid));

  const onExpandClick = () => {
    if (isExpanded) {
      onCollapse(`radio-${serialNumber}-${data.band}`);
    } else {
      onExpand(`radio-${serialNumber}-${data.band}`);
    }
  };

  const onSelect = () => {
    context.onSelectItem({
      type: 'RADIO',
      data,
      serialNumber,
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
          onClick={ssids.length > 0 ? onExpandClick : undefined}
        >
          {expandIcon(ssids.length, isExpanded)}
        </span>
        <Flex cursor="pointer" w="100%" alignItems="center" onClick={onSelect} {...selectedStyleProps()}>
          <span
            style={{
              marginRight: '4px',
            }}
          >
            <WifiHigh size={20} />
          </span>
          <Text>
            <pre>{data.band}G</pre>
          </Text>
          {ueIcon(data.amountOfUes)}
          {noiseIcon(data.averageRssi)}
        </Flex>
      </Flex>
      {isExpanded ? (
        <Box paddingLeft={`${childrenLevel * 6}px`} pt={2}>
          {ssids.map((ssid) => (
            <SsidMonitoringData
              key={`ssid-${ssid.bssid}`}
              data={ssid}
              expandedIds={expandedIds}
              onCollapse={onCollapse}
              onExpand={onExpand}
              level={childrenLevel}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

export default RadioMonitoringNode;
