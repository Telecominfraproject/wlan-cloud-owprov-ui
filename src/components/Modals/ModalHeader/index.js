import React from 'react';
import PropTypes from 'prop-types';
import { Flex, ModalHeader as Header, Spacer } from '@chakra-ui/react';

const propTypes = {
  title: PropTypes.string.isRequired,
  right: PropTypes.node.isRequired,
};

const ModalHeader = ({ title, right }) => (
  <Header>
    <Flex justifyContent="center" alignItems="center" maxW="100%" px={1}>
      {title}
      <Spacer />
      {right}
    </Flex>
  </Header>
);

ModalHeader.propTypes = propTypes;

export default ModalHeader;
