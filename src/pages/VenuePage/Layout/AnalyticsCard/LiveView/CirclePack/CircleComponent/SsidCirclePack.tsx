import React from 'react';
import {
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  Tag,
} from '@chakra-ui/react';
import { ComputedDatum } from '@nivo/circle-packing';
import { Interpolation, SpringValue, animated } from '@react-spring/web';
import { Broadcast } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { SsidCircle } from '../utils';
import { useCircleGraph } from 'contexts/CircleGraphProvider';
import { bytesString } from 'utils/stringHelper';

const SsidCirclePack = ({
  node,
  style,
  handleClicks,
}: {
  node: ComputedDatum<SsidCircle>;
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
          fill={node.data.details.color}
          stroke="black"
          strokeWidth="2px"
          cursor="pointer"
          strokeDasharray="4"
          opacity={style.opacity}
          onClick={handleClicks.onClick}
        />
      </PopoverTrigger>
      <Portal containerRef={context?.popoverRef}>
        <PopoverContent w="400px">
          <PopoverArrow />
          <PopoverCloseButton alignContent="center" mt={1} />
          <PopoverHeader display="flex">
            <Broadcast size={24} weight="fill" />
            <Text ml={2}>
              {node.data.details.band}G - {node?.data?.name.split('/')[0]}{' '}
              {node.data.children.length === 0 ? undefined : (
                <Tag colorScheme={node.data.details.tagColor} size="md">
                  <b>({node.data.details.avgRssi} avg db)</b>
                </Tag>
              )}
            </Text>
          </PopoverHeader>
          <PopoverBody px={0}>
            <Heading size="sm" pl={4}>
              BSSID: {node.data.details.bssid}
            </Heading>
            <Heading size="sm" pl={4}>
              {t('analytics.associations')}: {node.data.children.length}
            </Heading>
            <Box px={0} fontWeight="bold">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th w="150px" />
                    <Th>{t('common.avg')}</Th>
                    <Th>{t('common.min')}</Th>
                    <Th>{t('common.max')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td w="150px">TX {t('analytics.bandwidth')}</Td>
                    <Td>{bytesString(node.data.details.tx_bytes_bw.avg)}</Td>
                    <Td>{bytesString(node.data.details.tx_bytes_bw.min)}</Td>
                    <Td>{bytesString(node.data.details.tx_bytes_bw.max)}</Td>
                  </Tr>
                  <Tr>
                    <Td w="150px">TX {t('analytics.packets')} /s</Td>
                    <Td>{node.data.details.tx_packets_bw.avg.toFixed(2)}</Td>
                    <Td>{node.data.details.tx_packets_bw.min.toFixed(2)}</Td>
                    <Td>{node.data.details.tx_packets_bw.max.toFixed(2)}</Td>
                  </Tr>
                  <Tr>
                    <Td w="150px">RX {t('analytics.bandwidth')}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_bw.avg)}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_bw.min)}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_bw.max)}</Td>
                  </Tr>
                  <Tr>
                    <Td w="150px">RX {t('analytics.packets')} /s</Td>
                    <Td>{node.data.details.rx_packets_bw.avg.toFixed(2)}</Td>
                    <Td>{node.data.details.rx_packets_bw.min.toFixed(2)}</Td>
                    <Td>{node.data.details.rx_packets_bw.max.toFixed(2)}</Td>
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

export default SsidCirclePack;
