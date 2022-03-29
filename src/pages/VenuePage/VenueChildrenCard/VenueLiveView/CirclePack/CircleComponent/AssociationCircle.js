import React from 'react';
import PropTypes from 'prop-types';
import { animated } from '@react-spring/web';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { WifiHigh } from 'phosphor-react';
import { bytesString } from 'utils/stringHelper';
import { useTranslation } from 'react-i18next';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  handleClicks: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

const AssociationCircle = ({ node, style, handleClicks }) => {
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
            <WifiHigh weight="bold" size={24} />
            <Text ml={2}>
              {node?.data?.name.split('/')[0]} ({node.data.details.rssi} db)
            </Text>
          </PopoverHeader>
          <PopoverBody px={0}>
            <TableContainer px={0}>
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
                    <Td>{t('analytics.bandwidth')} /s</Td>
                    <Td>{bytesString(node.data.details.tx_bytes_bw)}</Td>
                    <Td>{bytesString(node.data.details.rx_bytes_bw)}</Td>
                  </Tr>
                  <Tr>
                    <Td>{t('analytics.packets')} /s</Td>
                    <Td>{node.data.details.tx_packets_bw.toLocaleString('en-US')}</Td>
                    <Td>{node.data.details.rx_packets_bw.toLocaleString('en-US')}</Td>
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
            </TableContainer>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

AssociationCircle.propTypes = propTypes;
export default React.memo(AssociationCircle);
