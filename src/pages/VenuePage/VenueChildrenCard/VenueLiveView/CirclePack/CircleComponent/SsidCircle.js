import React from 'react';
import PropTypes from 'prop-types';
import { animated } from '@react-spring/web';
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
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Broadcast } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { bytesString } from 'utils/stringHelper';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  handleClicks: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

const SsidCircle = ({ node, style, handleClicks }) => {
  const { t } = useTranslation();
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
            <Broadcast size={24} weight="fill" />
            <Text ml={2}>
              {node.data.details.band}G - {node?.data?.name.split('/')[0]} ({node.data.details.avgRssi} db)
            </Text>
          </PopoverHeader>
          <PopoverBody px={0}>
            <Heading size="sm" pl={4}>
              BSSID: {node.data.details.bssid}
            </Heading>
            <Heading size="sm" pl={4}>
              {t('analytics.associations')}: {node.data.children.length}
            </Heading>
            <TableContainer px={0}>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th />
                    <Th>{t('common.avg')}</Th>
                    <Th>{t('common.min')}</Th>
                    <Th>{t('common.max')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>TX {t('analytics.bandwidth')}</Td>
                    <Td>{bytesString(node.data.details.tx_bytes_bw.avg)}</Td>
                    <Td>{bytesString(node.data.details.tx_bytes_bw.min)}</Td>
                    <Td>{bytesString(node.data.details.tx_bytes_bw.max)}</Td>
                  </Tr>
                  <Tr>
                    <Td>TX {t('analytics.packets')} /s</Td>
                    <Td>{node.data.details.tx_packets_bw.avg}</Td>
                    <Td>{node.data.details.tx_packets_bw.min}</Td>
                    <Td>{node.data.details.tx_packets_bw.max}</Td>
                  </Tr>
                  <Tr>
                    <Td>RX {t('analytics.bandwidth')}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_bw.avg)}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_bw.min)}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_bw.max)}</Td>
                  </Tr>
                  <Tr>
                    <Td>RX {t('analytics.packets')} /s</Td>
                    <Td>{node.data.details.rx_packets_bw.avg}</Td>
                    <Td>{node.data.details.rx_packets_bw.min}</Td>
                    <Td>{node.data.details.rx_packets_bw.max}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

SsidCircle.propTypes = propTypes;
export default React.memo(SsidCircle);
