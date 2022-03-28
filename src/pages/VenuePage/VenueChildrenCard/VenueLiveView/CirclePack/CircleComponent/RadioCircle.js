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
            <Radio size={24} weight="fill" />
            <Text ml={2}>
              {t('analytics.band')} {node.data.details.band}
            </Text>
          </PopoverHeader>
          <PopoverBody>
            <Heading size="sm">
              {t('analytics.channel')}: {node.data.details.channel}
            </Heading>
            <Heading size="sm">
              {t('analytics.airtime')}: {Math.floor(node.data.details.transmitPct)}%
            </Heading>
            <Heading size="sm">
              {t('analytics.noise')}: {node.data.details.noise} db
            </Heading>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

RadioCircle.propTypes = propTypes;
export default React.memo(RadioCircle);
