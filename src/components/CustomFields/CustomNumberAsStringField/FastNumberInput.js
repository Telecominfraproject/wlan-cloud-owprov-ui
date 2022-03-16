import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';

const propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.bool,
  touched: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};

const defaultProps = {
  unit: null,
  error: false,
  touched: false,
  isRequired: false,
  isDisabled: false,
};

const FastNumberInput = ({ label, value, unit, onChange, onBlur, error, touched, isRequired, isDisabled }) => (
  <FormControl isInvalid={error && touched} isRequired={isRequired} isDisabled={isDisabled}>
    <FormLabel ms="4px" fontSize="md" fontWeight="normal">
      {label}
    </FormLabel>
    <InputGroup>
      <NumberInput
        allowMouseWheel
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        borderRadius="15px"
        fontSize="sm"
        w={24}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <InputRightAddon>{unit}</InputRightAddon>
    </InputGroup>
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);

FastNumberInput.propTypes = propTypes;
FastNumberInput.defaultProps = defaultProps;

export default React.memo(FastNumberInput);
