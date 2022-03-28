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
import { WifiHigh } from 'phosphor-react';
import { bytesString } from 'utils/stringHelper';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  handleClicks: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
};

const AssociationCircle = ({ node, style, handleClicks }) => (
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
          <Text ml={2}>{node?.data?.name.split('/')[0]}</Text>
        </PopoverHeader>
        <PopoverBody>
          <Heading size="sm">RSSI {node.data.details.rssi}</Heading>
          <Heading size="sm">TX {bytesString(node.data.details.tx_bytes)}</Heading>
          <Heading size="sm">RX {bytesString(node.data.details.rx_bytes)}</Heading>
        </PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
);

AssociationCircle.propTypes = propTypes;
export default React.memo(AssociationCircle);
