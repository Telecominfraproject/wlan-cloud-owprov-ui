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
  Tag,
  Text,
} from '@chakra-ui/react';
import { ComputedDatum } from '@nivo/circle-packing';
import { Interpolation, SpringValue, animated } from '@react-spring/web';
import { Buildings } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { CirclePackRoot } from '../utils';
import { useCircleGraph } from 'contexts/CircleGraphProvider';

const VenueCirclePack = ({
  node,
  style,
  handleClicks,
}: {
  node: ComputedDatum<CirclePackRoot>;
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
          cursor="pointer"
          fill={node.data.details.color}
          stroke="black"
          strokeWidth="3px"
          opacity={style.opacity}
          onClick={handleClicks.onClick}
        />
      </PopoverTrigger>
      <Portal containerRef={context?.popoverRef}>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton alignContent="center" mt={1} />
          <PopoverHeader display="flex">
            <Buildings weight="fill" size={24} />
            <Text ml={2}>{node?.data?.name.split('/')[0]}</Text>
          </PopoverHeader>
          <PopoverBody>
            <Heading size="sm">
              {node.data.children.length} {t('devices.title')}
            </Heading>
            <Heading size="sm">
              <Tag colorScheme={node.data.details.tagColor} size="md">
                <b>
                  {node.data.details.avgHealth}% {t('analytics.average_health')}
                </b>
              </Tag>
            </Heading>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default VenueCirclePack;
