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

const CardBody = ({ variant, children, ...props }) => {
  const styles = useStyleConfig('CardBody', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...props}>
      {children}
    </Box>
  );
};

CardBody.propTypes = propTypes;
CardBody.defaultProps = defaultProps;

export default CardBody;
