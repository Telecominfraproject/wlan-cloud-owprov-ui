/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import { Globe } from '@phosphor-icons/react';
import { ApMonitoringData, expandIcon, healthIcon, noiseIcon, ueIcon } from '../utils';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import RadioMonitoringNode from './RadioMonitoringNode';

type Props = {
  data: ApMonitoringData;
  level: number;
  expandedIds: {
    [key: string]: boolean;
  };
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
};

const ApMonitoringNode = ({ data, level, expandedIds, onExpand, onCollapse }: Props) => {
  const childrenLevel = level + 1;
  const context = useVenueMonitoring();
  const { colorMode } = useColorMode();
  const isSelected =
    context.selectedItem?.type === 'AP' &&
    context.selectedItem.data.dashboardData.serialNumber === data.dashboardData.serialNumber;
  const isExpanded = expandedIds[`ap-${data.dashboardData.serialNumber}`] === true;
  const radios = Object.values(data.radios);

  const onExpandClick = () => {
    if (isExpanded) {
      onCollapse(`ap-${data.dashboardData.serialNumber}`);
    } else {
      onExpand(`ap-${data.dashboardData.serialNumber}`);
    }
  };

  const onSelect = () => {
    context.onSelectItem({
      type: 'AP',
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
          onClick={radios.length > 0 ? onExpandClick : undefined}
        >
          {expandIcon(radios.length, isExpanded)}
        </span>
        <Flex cursor="pointer" w="100%" alignItems="center" onClick={onSelect} {...selectedStyleProps()}>
          <span
            style={{
              marginRight: '4px',
            }}
          >
            <Globe size={20} weight="fill" />
          </span>
          <Text>
            <pre>{data.serialNumber}</pre>
          </Text>
          {ueIcon(data.ues)}
          {healthIcon(data.dashboardData.health)}
          {noiseIcon(data.averageRssi)}
        </Flex>
      </Flex>
      {isExpanded ? (
        <Box paddingLeft={`${childrenLevel * 6}px`} pt={2}>
          {radios.map((radio) => (
            <RadioMonitoringNode
              key={`radio-${radio.band}`}
              serialNumber={data.dashboardData.serialNumber}
              data={radio}
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

export default ApMonitoringNode;
