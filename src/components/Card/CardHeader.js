import React from 'react';
import PropTypes from 'prop-types';
import { Box, useStyleConfig } from '@chakra-ui/react';

const propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  variant: null,
};

const CardHeader = ({ variant, children, ...rest }) => {
  const styles = useStyleConfig('CardHeader', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
};

CardHeader.propTypes = propTypes;
CardHeader.defaultProps = defaultProps;

export default CardHeader;
