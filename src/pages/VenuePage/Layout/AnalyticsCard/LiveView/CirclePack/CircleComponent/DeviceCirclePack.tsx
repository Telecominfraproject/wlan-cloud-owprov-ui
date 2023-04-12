import React, { useMemo } from 'react';
import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  Tooltip,
  Table,
  Tbody,
  Td,
  Tr,
  Box,
  Flex,
  Tag as TagDisplay,
} from '@chakra-ui/react';
import { ComputedDatum } from '@nivo/circle-packing';
import { Interpolation, SpringValue, animated } from '@react-spring/web';
import { ArrowSquareOut, Tag } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { DeviceCircleInfo } from '../utils';
import FormattedDate from 'components/FormattedDate';
import { useCircleGraph } from 'contexts/CircleGraphProvider';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import { bytesString } from 'utils/stringHelper';

const DeviceCirclePack = ({
  node,
  style,
  handleClicks,
}: {
  node: ComputedDatum<DeviceCircleInfo>;
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
  const { data: gwUi } = useGetGatewayUi();
  const context = useCircleGraph();

  const handleOpenInGateway = useMemo(
    () => () => window.open(`${gwUi}/#/devices/${node.data.details.deviceInfo.serialNumber}`, '_blank'),
    [gwUi],
  );

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
          strokeWidth="1px"
          cursor="pointer"
          opacity={style.opacity}
          onClick={handleClicks.onClick}
        />
      </PopoverTrigger>
      <Portal containerRef={context?.popoverRef}>
        <PopoverContent w="580px">
          <PopoverArrow />
          <PopoverCloseButton alignContent="center" mt={1} />
          <PopoverHeader display="flex">
            <Tag size={24} weight="fill" />
            <Text ml={2}>{node?.data?.name.split('/')[0]}</Text>
            <Tooltip hasArrow label={t('common.view_in_gateway')} placement="top">
              <IconButton
                aria-label={t('common.view_in_gateway')}
                ml={2}
                colorScheme="blue"
                icon={<ArrowSquareOut size={20} />}
                size="xs"
                onClick={handleOpenInGateway}
              />
            </Tooltip>
          </PopoverHeader>
          <PopoverBody>
            <Box px={0} fontWeight="bold" w="100%">
              <Table variant="simple" size="sm">
                <Tbody>
                  <Tr>
                    <Td w="130px">{t('common.type')}</Td>
                    <Td>
                      {node.data.details.deviceInfo.deviceType === ''
                        ? t('common.unknown')
                        : node.data.details.deviceInfo.deviceType}
                    </Td>
                    <Td w="150px">TX {t('analytics.delta')}</Td>
                    <Td>{bytesString(node.data.details.apData.tx_bytes_delta)}</Td>
                  </Tr>
                  <Tr>
                    <Td w="130px">{t('analytics.firmware')}</Td>
                    <Td>{node.data.details.deviceInfo.lastFirmware?.split('/')[1] ?? t('common.unknown')}</Td>
                    <Td w="150px">RX {t('analytics.delta')}</Td>
                    <Td>{bytesString(node.data.details.apData.rx_bytes_delta)}</Td>
                  </Tr>
                  <Tr>
                    <Td w="130px">SSIDs</Td>
                    <Td>{node.data.children.length}</Td>
                    <Td w="150px">2G {t('analytics.associations')}</Td>
                    <Td>{node.data.details.deviceInfo.associations_2g}</Td>
                  </Tr>
                  <Tr>
                    <Td w="130px">{t('analytics.health')}</Td>
                    <Td>
                      <TagDisplay ml={-2} colorScheme={node.data.details.tagColor} size="md">
                        <b>{node.data.details.deviceInfo.health}%</b>
                      </TagDisplay>
                    </Td>
                    <Td w="150px">5G {t('analytics.associations')}</Td>
                    <Td>{node.data.details.deviceInfo.associations_5g}</Td>
                  </Tr>
                  <Tr>
                    <Td w="130px">{t('analytics.memory_used')}</Td>
                    <Td>{Math.floor(node.data.details.deviceInfo.memory)}%</Td>
                    <Td w="150px">6G {t('analytics.associations')}</Td>
                    <Td>{node.data.details.deviceInfo.associations_6g}</Td>
                  </Tr>
                </Tbody>
              </Table>
              {node.data.details.deviceInfo.lastDisconnection !== 0 && (
                <Flex ml={4}>
                  <Text mr={1}>{t('analytics.last_disconnection')}</Text>
                  <Text>
                    <FormattedDate date={node.data.details.deviceInfo.lastDisconnection} />
                  </Text>
                </Flex>
              )}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default DeviceCirclePack;
