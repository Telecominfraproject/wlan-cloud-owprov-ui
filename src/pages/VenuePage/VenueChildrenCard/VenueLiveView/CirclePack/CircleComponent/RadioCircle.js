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
  Tbody,
  Td,
  Tr,
  Box,
  Tag,
} from '@chakra-ui/react';
import { Radio } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useCircleGraph } from 'contexts/CircleGraphProvider';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  handleClicks: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

const RadioCircle = ({ node, style, handleClicks }) => {
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
          fill={node.data.details.color}
          stroke="blue"
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
            <Radio size={24} weight="fill" />
            <Text ml={2} mt="2px">
              {node.data.details.band}G
            </Text>
          </PopoverHeader>
          <PopoverBody>
            <Box px={0} fontWeight="bold">
              <Table variant="simple" size="sm">
                <Tbody>
                  <Tr>
                    <Td w="100px">{t('analytics.noise')}</Td>
                    <Td>{node.data.details.noise} db</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.channel')}</Td>
                    <Td>{node.data.details.channel}</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.airtime')}</Td>
                    <Td>
                      <Tag ml={-2} colorScheme={node.data.details.tagColor} size="md">
                        <b>{node.data.details.transmitPct.toFixed(2)}%</b>
                      </Tag>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.active')}</Td>
                    <Td>{node.data.details.active_pct.toFixed(2)}%</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.busy')}</Td>
                    <Td>{node.data.details.busy_pct.toFixed(2)}%</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.receive')}</Td>
                    <Td>{node.data.details.receive_pct.toFixed(2)}%</Td>
                  </Tr>
                  <Tr>
                    <Td w="100px">{t('analytics.temperature')}</Td>
                    <Td>{node.data.details.temperature}&#8451;</Td>
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

RadioCircle.propTypes = propTypes;
export default React.memo(RadioCircle);
