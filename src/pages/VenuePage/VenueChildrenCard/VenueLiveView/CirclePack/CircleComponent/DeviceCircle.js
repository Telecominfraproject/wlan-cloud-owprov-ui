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
  TableContainer,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react';
import { ArrowSquareOut, Tag } from 'phosphor-react';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import FormattedDate from 'components/FormattedDate';
import { useTranslation } from 'react-i18next';

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

  const handleOpenInGateway = useMemo(
    () => () => window.open(`${gwUi}/#/devices/${node.data.details.deviceInfo.serialNumber}`, '_blank'),
    [gwUi],
  );

  return (
    <Popover isLazy trigger="hover" placement="top">
      <PopoverTrigger>
        <animated.circle
          key={node.id}
          cx={style.x}
          cy={style.y}
          r={style.radius}
          fill={node.data.details.color}
          stroke="black"
          strokeWidth="1px"
          opacity={style.opacity}
          onClick={handleClicks.onClick}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
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
            <TableContainer px={0} fontWeight="bold">
              <Table variant="simple" size="sm">
                <Tbody>
                  <Tr>
                    <Td w="100px">SSIDs</Td>
                    <Td>{node.data.children.length}</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.health')}</Td>
                    <Td>{node.data.details.deviceInfo.health}%</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.memory_used')}</Td>
                    <Td>{Math.floor(node.data.details.deviceInfo.memory)}%</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">2G {t('analytics.associations')}</Td>
                    <Td>{node.data.details.deviceInfo.associations_2g}</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">5G {t('analytics.associations')}</Td>
                    <Td>{node.data.details.deviceInfo.associations_5g}</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">6G {t('analytics.associations')}</Td>
                    <Td>{node.data.details.deviceInfo.associations_6g}</Td>
                  </Tr>
                  {node.data.details.deviceInfo.lastDisconnection !== 0 && (
                    <Tr>
                      <Td w="100px">{t('analytics.last_disconnection')}</Td>
                      <Td>
                        <FormattedDate date={node.data.details.deviceInfo.lastDisconnection} />
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

DeviceCircle.propTypes = propTypes;
export default React.memo(DeviceCircle);
