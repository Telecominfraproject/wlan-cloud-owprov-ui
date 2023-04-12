import React from 'react';
import { LabelComponent, LabelProps } from '@nivo/circle-packing';
import { animated } from '@react-spring/web';
import { CirclePackRoot } from './utils';

const CircleLabel: LabelComponent<CirclePackRoot> = ({ label, node, style }: LabelProps<CirclePackRoot>) => (
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
    {typeof label === 'string' ? label.split('/')[0] : label}
  </animated.text>
);

export default CircleLabel;
