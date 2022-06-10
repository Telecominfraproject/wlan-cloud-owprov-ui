import React from 'react';
import PropTypes from 'prop-types';
import { animated } from '@react-spring/web';
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
import { WifiHigh } from 'phosphor-react';
import { bytesString, formatNumberToScientificBasedOnMax } from 'utils/stringHelper';
import { useTranslation } from 'react-i18next';
import { useCircleGraph } from 'contexts/CircleGraphProvider';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  handleClicks: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

const AssociationCircle = ({ node, style, handleClicks }) => {
  const { t } = useTranslation();
  const { popoverRef } = useCircleGraph();

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
      <Portal containerRef={popoverRef}>
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

AssociationCircle.propTypes = propTypes;
export default React.memo(AssociationCircle);
