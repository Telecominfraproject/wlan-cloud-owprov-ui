/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import { Devices } from '@phosphor-icons/react';
import { UeMonitoringData, noiseIcon } from '../utils';
import { useVenueMonitoring } from '../VenueMonitoringContext';

type Props = {
  data: UeMonitoringData;
};

const UeMonitoringNode = ({ data }: Props) => {
  const { colorMode } = useColorMode();
  const context = useVenueMonitoring();
  const isSelected = context.selectedItem?.type === 'UE' && context.selectedItem.data.station === data.station;

  const onSelect = () => {
    context.onSelectItem({
      type: 'UE',
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
    <Box mb={1}>
      <Flex alignItems="center" w="min-content">
        <span
          style={{
            width: '16px',
            cursor: 'pointer',
            paddingRight: '4px',
          }}
        />
        <Flex cursor="pointer" alignItems="center" onClick={onSelect} {...selectedStyleProps()}>
          <span
            style={{
              marginRight: '4px',
            }}
          >
            <Devices size={20} />
          </span>
          <Text>
            <pre>{data.station}</pre>
          </Text>
          {noiseIcon(data.rssi)}
        </Flex>
      </Flex>
    </Box>
  );
};

export default UeMonitoringNode;
