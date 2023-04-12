import React, { useMemo } from 'react';
import { ComputedDatum, CircleComponent as CircleComponentT, CircleProps } from '@nivo/circle-packing';
import { Interpolation, SpringValue } from '@react-spring/web';
import { AssociationCircle, CirclePackRoot, DeviceCircleInfo, RadioCircle, SsidCircle } from '../utils';
import AssociationCirclePack from './AssociationCirclePack';
import DeviceCirclePack from './DeviceCirclePack';
import RadioCirclePack from './RadioCirclePack';
import SsidCirclePack from './SsidCirclePack';
import VenueCirclePack from './VenueCirclePack';

const CircleComponent: CircleComponentT<
  CirclePackRoot | SsidCircle | RadioCircle | AssociationCircle | DeviceCircleInfo
> = ({
  node,
  style,
  onClick,
}: CircleProps<CirclePackRoot | SsidCircle | RadioCircle | AssociationCircle | DeviceCircleInfo>) => {
  const handleClicks = useMemo(
    () => ({
      onClick: (e: React.MouseEvent<SVGCircleElement>) => {
        if (onClick) onClick(node, e);
      },
    }),
    [onClick, node],
  );
  if (node.data.type === 'association')
    return (
      <AssociationCirclePack
        node={node as ComputedDatum<AssociationCircle>}
        style={
          style as unknown as {
            x: SpringValue<number>;
            y: SpringValue<number>;
            radius: Interpolation<number>;
            textColor: SpringValue<string>;
            opacity: SpringValue<number>;
          }
        }
        handleClicks={handleClicks}
      />
    );
  if (node.data.type === 'ssid')
    return (
      <SsidCirclePack
        node={node as ComputedDatum<SsidCircle>}
        style={
          style as unknown as {
            x: SpringValue<number>;
            y: SpringValue<number>;
            radius: Interpolation<number>;
            textColor: SpringValue<string>;
            opacity: SpringValue<number>;
          }
        }
        handleClicks={handleClicks}
      />
    );
  if (node.data.type === 'radio')
    return (
      <RadioCirclePack
        node={node as ComputedDatum<RadioCircle>}
        style={
          style as unknown as {
            x: SpringValue<number>;
            y: SpringValue<number>;
            radius: Interpolation<number>;
            textColor: SpringValue<string>;
            opacity: SpringValue<number>;
          }
        }
        handleClicks={handleClicks}
      />
    );
  if (node.data.type === 'device')
    return (
      <DeviceCirclePack
        node={node as ComputedDatum<DeviceCircleInfo>}
        style={
          style as unknown as {
            x: SpringValue<number>;
            y: SpringValue<number>;
            radius: Interpolation<number>;
            textColor: SpringValue<string>;
            opacity: SpringValue<number>;
          }
        }
        handleClicks={handleClicks}
      />
    );
  if (node.data.type === 'venue')
    return (
      <VenueCirclePack
        node={node as ComputedDatum<CirclePackRoot>}
        style={
          style as unknown as {
            x: SpringValue<number>;
            y: SpringValue<number>;
            radius: Interpolation<number>;
            textColor: SpringValue<string>;
            opacity: SpringValue<number>;
          }
        }
        handleClicks={handleClicks}
      />
    );

  return null;
};

export default CircleComponent;
