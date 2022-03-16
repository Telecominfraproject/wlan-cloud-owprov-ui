import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, useColorMode } from '@chakra-ui/react';

const propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

const LoadingOverlay = ({ isLoading, children }) => {
  const { colorMode } = useColorMode();

  const style = {
    top: '0px',
    right: '0px',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colorMode === 'light' ? 'var(--chakra-colors-gray-200)' : 'var(--chakra-colors-gray-900)',
    zIndex: '1100',
    opacity: '0.4',
    filter: 'alpha(opacity=40)',
    textAlign: 'center',
    verticalAlign: 'middle',
    borderRadius: '5px',
  };

  return (
    <>
      {isLoading && (
        <div style={style}>
          <Spinner position="absolute" top="45%" size="xl" />
        </div>
      )}
      {children}
    </>
  );
};

LoadingOverlay.propTypes = propTypes;

export default LoadingOverlay;
