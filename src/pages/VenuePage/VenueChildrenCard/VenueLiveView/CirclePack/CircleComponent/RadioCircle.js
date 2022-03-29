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
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react';
import { Radio } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  handleClicks: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

const RadioCircle = ({ node, style, handleClicks }) => {
  const { t } = useTranslation();

  return (
    <Popover trigger="hover" placement="top">
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
            <Radio size={24} weight="fill" />
            <Text ml={2} mt="2px">
              {node.data.details.band}G
            </Text>
          </PopoverHeader>
          <PopoverBody>
            <TableContainer px={0}>
              <Table variant="simple" size="sm">
                <Tbody>
                  <Tr>
                    <Td w="100px">{t('analytics.channel')}</Td>
                    <Td>{node.data.details.channel}</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.noise')}</Td>
                    <Td>{node.data.details.noise} db</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">Active</Td>
                    <Td>{node.data.details.active_pct.toFixed(2)}%</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">Busy</Td>
                    <Td>{node.data.details.busy_pct.toFixed(2)}%</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">Receive</Td>
                    <Td>{node.data.details.receive_pct.toFixed(2)}%</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.airtime')}</Td>
                    <Td>{node.data.details.transmitPct.toFixed(2)}%</Td>
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

RadioCircle.propTypes = propTypes;
export default React.memo(RadioCircle);
