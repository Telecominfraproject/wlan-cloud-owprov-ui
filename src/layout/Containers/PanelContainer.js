import React from 'react';
import PropTypes from 'prop-types';
import { Box, useStyleConfig } from '@chakra-ui/react';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const PanelContainer = ({ children }) => {
  const styles = useStyleConfig('PanelContainer');
  // Pass the computed styles into the `__css` prop
  return <Box __css={styles}>{children}</Box>;
};

PanelContainer.propTypes = propTypes;

export default PanelContainer;
