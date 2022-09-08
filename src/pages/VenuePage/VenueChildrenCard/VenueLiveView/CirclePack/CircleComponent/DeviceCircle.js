import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { animated } from '@react-spring/web';
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
import { ArrowSquareOut, Tag } from 'phosphor-react';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import FormattedDate from 'components/FormattedDate';
import { useTranslation } from 'react-i18next';
import { useCircleGraph } from 'contexts/CircleGraphProvider';
import { bytesString } from 'utils/stringHelper';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  handleClicks: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

const DeviceCircle = ({ node, style, handleClicks }) => {
  const { t } = useTranslation();
  const { data: gwUi } = useGetGatewayUi();
  const { popoverRef } = useCircleGraph();

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
      <Portal containerRef={popoverRef}>
        <PopoverContent w="580px">
          <PopoverArrow />
          <PopoverCloseButton alignContent="center" mt={1} />
          <PopoverHeader display="flex">
            <Tag size={24} weight="fill" />
            <Text ml={2}>{node?.data?.name.split('/')[0]}</Text>
            <Tooltip hasArrow label={t('common.view_in_gateway')} placement="top">
              <IconButton
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
                    <Td>{bytesString(node.data.details.tx_bytes_delta)}</Td>
                  </Tr>
                  <Tr>
                    <Td w="130px">{t('analytics.firmware')}</Td>
                    <Td>{node.data.details.deviceInfo.lastFirmware?.split('/')[1] ?? t('common.unknown')}</Td>
                    <Td w="150px">RX {t('analytics.delta')}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_delta)}</Td>
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

DeviceCircle.propTypes = propTypes;
export default React.memo(DeviceCircle);
