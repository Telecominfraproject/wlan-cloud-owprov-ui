import React from 'react';
import PropTypes from 'prop-types';
import { Box, useStyleConfig } from '@chakra-ui/react';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const PanelContent = ({ children }) => {
  const styles = useStyleConfig('PanelContent');

  return <Box __css={styles}>{children}</Box>;
};

PanelContent.propTypes = propTypes;

export default PanelContent;
