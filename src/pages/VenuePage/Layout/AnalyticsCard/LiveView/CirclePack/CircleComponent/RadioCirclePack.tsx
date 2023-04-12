import React from 'react';
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
import { ComputedDatum } from '@nivo/circle-packing';
import { Interpolation, SpringValue, animated } from '@react-spring/web';
import { Radio } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { RadioCircle } from '../utils';
import { useCircleGraph } from 'contexts/CircleGraphProvider';

const RadioCirclePack = ({
  node,
  style,
  handleClicks,
}: {
  node: ComputedDatum<RadioCircle>;
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
          stroke="blue"
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
                        <b>{node.data.details.transmit_pct.toFixed(2)}%</b>
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

export default RadioCirclePack;
