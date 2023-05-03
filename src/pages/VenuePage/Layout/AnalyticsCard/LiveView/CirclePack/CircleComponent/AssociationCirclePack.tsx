import React from 'react';
import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ComputedDatum } from '@nivo/circle-packing';
import { Interpolation, SpringValue, animated } from '@react-spring/web';
import { WifiHigh } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { AssociationCircle } from '../utils';
import { useCircleGraph } from 'contexts/CircleGraphProvider';
import { bytesString, formatNumberToScientificBasedOnMax } from 'utils/stringHelper';

const AssociationCirclePack = ({
  node,
  style,
  handleClicks,
}: {
  node: ComputedDatum<AssociationCircle>;
  style: {
    x: SpringValue<number>;
    y: SpringValue<number>;
    radius: Interpolation<number>;
    textColor: SpringValue<string>;
    opacity: SpringValue<number>;
  };
  handleClicks: {
    onClick: (e: React.MouseEvent<SVGCircleElement>) => void;
  };
}) => {
  const { t } = useTranslation();
  const context = useCircleGraph();

  return (
    <Popover isLazy trigger="hover" placement="auto">
      <PopoverTrigger>
        <animated.circle
          key={node.id}
          cx={style.x}
          cy={style.y}
          r={style.radius}
          fill={node.fill}
          stroke="black"
          cursor="pointer"
          strokeWidth="1px"
          opacity={style.opacity}
          onClick={handleClicks.onClick}
        />
      </PopoverTrigger>
      <Portal containerRef={context?.popoverRef}>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton alignContent="center" mt={1} />
          <PopoverHeader display="flex">
            <WifiHigh weight="bold" size={24} />
            <Text ml={2}>
              {node?.data?.name.split('/')[0]}
              <Tag ml={2} colorScheme={node.data.details.tagColor} size="md">
                <b>({node.data.details.rssi} db)</b>
              </Tag>
            </Text>
          </PopoverHeader>
          <PopoverBody px={0}>
            <Box px={0} fontWeight="bold">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th />
                    <Th>TX</Th>
                    <Th>RX</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{t('analytics.total_data')}</Td>
                    <Td>{bytesString(node.data.details.tx_bytes)}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes)}</Td>
                  </Tr>
                  <Tr>
                    <Td>{t('analytics.delta')}</Td>
                    <Td>{bytesString(node.data.details.tx_bytes_delta)}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_delta)}</Td>
                  </Tr>
                  <Tr>
                    <Td>{t('analytics.bandwidth')}</Td>
                    <Td>{bytesString(node.data.details.tx_bytes_bw)}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_bw)}</Td>
                  </Tr>
                  <Tr>
                    <Td>{t('analytics.packets')} /s</Td>
                    <Td>{formatNumberToScientificBasedOnMax(node.data.details.tx_packets_bw)}</Td>
                    <Td>{formatNumberToScientificBasedOnMax(node.data.details.rx_packets_bw)}</Td>
                  </Tr>
                  <Tr>
                    <Td>MCS</Td>
                    <Td>{node.data.details.tx_rate.mcs}</Td>
                    <Td>{node.data.details.rx_rate.mcs}</Td>
                  </Tr>
                  <Tr>
                    <Td>NSS</Td>
                    <Td>{node.data.details.tx_rate.nss}</Td>
                    <Td>{node.data.details.rx_rate.nss}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default AssociationCirclePack;
