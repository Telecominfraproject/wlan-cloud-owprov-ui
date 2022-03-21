import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Tooltip } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import Card from 'components/Card';

const propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  explanation: PropTypes.string,
  color: PropTypes.string,
  openModal: PropTypes.func,
  element: PropTypes.node,
};

const defaultProps = {
  title: '',
  label: '',
  explanation: '',
  color: null,
  openModal: null,
  element: null,
};

const SimpleStatDisplay = ({ title, label, explanation, color, openModal, element, ...props }) => (
  <Card
    bgColor={color}
    variant="widget"
    onClick={openModal}
    cursor={openModal ? 'pointer' : ''}
    className="tile-shadow-animate"
    {...props}
  >
    {title !== '' && (
      <Heading size="md">
        {title}
        <Tooltip hasArrow label={explanation}>
          <InfoIcon ml={2} mb="2px" />
        </Tooltip>
      </Heading>
    )}
    {element ?? (
      <Heading size="sm">
        {label}
        {title === '' && (
          <Tooltip hasArrow label={explanation}>
            <InfoIcon ml={2} mb="2px" />
          </Tooltip>
        )}
      </Heading>
    )}
  </Card>
);

SimpleStatDisplay.propTypes = propTypes;
SimpleStatDisplay.defaultProps = defaultProps;
export default React.memo(SimpleStatDisplay);
