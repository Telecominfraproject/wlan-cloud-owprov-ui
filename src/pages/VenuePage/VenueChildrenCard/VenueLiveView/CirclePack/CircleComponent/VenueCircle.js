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
  Tag,
  Text,
} from '@chakra-ui/react';
import { Buildings } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useCircleGraph } from 'contexts/CircleGraphProvider';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  handleClicks: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

const VenueCircle = ({ node, style, handleClicks }) => {
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
          cursor="pointer"
          fill={node.data.details.color}
          stroke="black"
          strokeWidth="3px"
          opacity={style.opacity}
          onClick={handleClicks.onClick}
        />
      </PopoverTrigger>
      <Portal containerRef={popoverRef}>
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

VenueCircle.propTypes = propTypes;
export default React.memo(VenueCircle);
