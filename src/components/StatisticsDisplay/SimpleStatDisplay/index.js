import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Tooltip } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import Card from 'components/Card';

const propTypes = {
  label: PropTypes.string.isRequired,
  explanation: PropTypes.string.isRequired,
  color: PropTypes.string,
};

const defaultProps = {
  color: null,
};

const SimpleStatDisplay = ({ label, explanation, color }) => (
  <Card bgColor={color} variant="widget">
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
