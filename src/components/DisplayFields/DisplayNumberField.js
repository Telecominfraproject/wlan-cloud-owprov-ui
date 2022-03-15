import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, NumberInput, NumberInputField } from '@chakra-ui/react';

const propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isRequired: PropTypes.bool,
  w: PropTypes.number,
};

const defaultProps = {
  isRequired: false,
  w: null,
};

const DisplayNumberField = ({ label, value, isRequired, w }) => (
  <FormControl isRequired={isRequired} isDisabled>
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label}
    </FormLabel>
    <NumberInput allowMouseWheel value={value} borderRadius="15px" fontSize="sm" w={w}>
      <NumberInputField />
    </NumberInput>
  </FormControl>
);

DisplayNumberField.propTypes = propTypes;
DisplayNumberField.defaultProps = defaultProps;
export default DisplayNumberField;
