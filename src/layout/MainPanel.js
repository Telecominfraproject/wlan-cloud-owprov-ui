import React from 'react';
import PropTypes from 'prop-types';
import { Box, useStyleConfig } from '@chakra-ui/react';

const MainPanel = ({ children, w }) => {
  const styles = useStyleConfig('MainPanel');

  return (
    <Box __css={styles} w={w}>
      {children}
    </Box>
  );
};

MainPanel.propTypes = {
  children: PropTypes.node.isRequired,
  w: PropTypes.instanceOf(Object).isRequired,
};

export default MainPanel;
