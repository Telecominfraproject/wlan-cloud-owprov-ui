import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import AssociationCircle from './AssociationCircle';
import DeviceCircle from './DeviceCircle';
import SsidCircle from './SsidCircle';
import VenueCircle from './VenueCircle';
import RadioCircle from './RadioCircle';

const propTypes = {
  node: PropTypes.instanceOf(Object).isRequired,
  style: PropTypes.instanceOf(Object).isRequired,
  onClick: PropTypes.func.isRequired,
};

const CircleComponent = ({ node, style, onClick }) => {
  const handleClicks = useMemo(
    () => ({
      onClick: (e) => {
        onClick(node, e);
      },
    }),
    [onClick, node],
  );
  if (node.data.type === 'association')
    return <AssociationCircle node={node} style={style} handleClicks={handleClicks} />;
  if (node.data.type === 'ssid') return <SsidCircle node={node} style={style} handleClicks={handleClicks} />;
  if (node.data.type === 'radio') return <RadioCircle node={node} style={style} handleClicks={handleClicks} />;
  if (node.data.type === 'device') return <DeviceCircle node={node} style={style} handleClicks={handleClicks} />;
  if (node.data.type === 'venue') return <VenueCircle node={node} style={style} handleClicks={handleClicks} />;
  return null;
};

CircleComponent.propTypes = propTypes;
export default CircleComponent;
