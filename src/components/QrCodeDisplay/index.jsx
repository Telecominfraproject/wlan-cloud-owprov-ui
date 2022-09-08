import React from 'react';
import PropTypes from 'prop-types';
import { useColorModeValue } from '@chakra-ui/react';

const propTypes = {
  path: PropTypes.string.isRequired,
};

const QrCodeDisplay = ({ path }) => {
  const pathColor = useColorModeValue('#000000', '#FFFFFF');
  const backgroundColor = useColorModeValue('#FFFFFF', 'var(--chakra-colors-blue-900)');
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 49 49"
      stroke="none"
      style={{ borderRadius: '10px' }}
    >
      <rect width="100%" height="100%" fill={backgroundColor} />
      <path width="100%" height="100%" d={path} fill={pathColor} />
    </svg>
  );
};

QrCodeDisplay.propTypes = propTypes;
export default QrCodeDisplay;
