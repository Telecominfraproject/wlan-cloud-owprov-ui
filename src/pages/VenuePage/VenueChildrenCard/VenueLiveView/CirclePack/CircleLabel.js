import React from 'react';
import PropTypes from 'prop-types';
import { animated } from '@react-spring/web';

const propTypes = {
  label: PropTypes.string.isRequired,
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  style: PropTypes.shape({
    x: PropTypes.instanceOf(Object).isRequired,
    y: PropTypes.instanceOf(Object).isRequired,
    textColor: PropTypes.instanceOf(Object).isRequired,
    opacity: PropTypes.instanceOf(Object).isRequired,
  }).isRequired,
};

const CircleLabel = ({ label, node, style }) => (
  <animated.text
    key={node.id}
    x={style.x}
    y={style.y}
    textAnchor="middle"
    dominantBaseline="central"
    style={{
      fill: style.textColor,
      opacity: style.opacity,
      pointerEvents: 'none',
    }}
  >
    {label.split('/')[0]}
  </animated.text>
);

CircleLabel.propTypes = propTypes;
export default React.memo(CircleLabel);
