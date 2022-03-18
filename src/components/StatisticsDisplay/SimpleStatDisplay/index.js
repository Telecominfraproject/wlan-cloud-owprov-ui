import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Tooltip } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import Card from 'components/Card';

const propTypes = {
  label: PropTypes.string.isRequired,
  explanation: PropTypes.string.isRequired,
  color: PropTypes.string,
  openModal: PropTypes.func,
};

const defaultProps = {
  color: null,
  openModal: null,
};

const SimpleStatDisplay = ({ label, explanation, color, openModal }) => (
  <Card
    bgColor={color}
    variant="widget"
    onClick={openModal}
    cursor={openModal ? 'pointer' : ''}
    _hover={{ boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)' }}
  >
    <Heading size="md">
      {label}
      <Tooltip hasArrow label={explanation}>
        <InfoIcon ml={2} mb="2px" />
      </Tooltip>
    </Heading>
  </Card>
);

SimpleStatDisplay.propTypes = propTypes;
SimpleStatDisplay.defaultProps = defaultProps;
export default React.memo(SimpleStatDisplay);
