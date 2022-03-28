import React from 'react';
import { Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const IconBox = ({ children, ...rest }) => (
  <Flex alignItems="center" justifyContent="center" borderRadius="12px" {...rest}>
    {children}
  </Flex>
);

IconBox.propTypes = propTypes;

export default IconBox;
