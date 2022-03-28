import React from 'react';
import PropTypes from 'prop-types';
import { ArrowDown, ArrowUp, Circle } from 'phosphor-react';
import { Icon } from '@chakra-ui/react';

const propTypes = {
  isSorted: PropTypes.bool.isRequired,
  isSortedDesc: PropTypes.bool,
  canSort: PropTypes.bool.isRequired,
};

const defaultProps = {
  isSortedDesc: false,
};

const SortIcon = ({ isSorted, isSortedDesc, canSort }) => {
  if (canSort) {
    if (isSorted) {
      return isSortedDesc ? <Icon pt={2} h={5} w={5} as={ArrowDown} /> : <Icon pt={2} h={5} w={5} as={ArrowUp} />;
    }
    return <Icon pt={2} h={5} w={5} as={Circle} />;
  }
  return null;
};

SortIcon.propTypes = propTypes;
SortIcon.defaultProps = defaultProps;
export default React.memo(SortIcon);
