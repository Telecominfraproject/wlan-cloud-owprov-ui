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
import ConfigurationFieldExplanation from '../ConfigurationFieldExplanation';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  touched: PropTypes.bool,
  hideArrows: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  element: PropTypes.node,
  w: PropTypes.number,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  value: '',
  unit: null,
  error: false,
  touched: false,
  isRequired: false,
  hideArrows: false,
  isDisabled: false,
  element: null,
  w: undefined,
  definitionKey: null,
};

const FastNumberInput = ({
  label,
  value,
  unit,
  onChange,
  onBlur,
  error,
  touched,
  isRequired,
  hideArrows,
  element,
  isDisabled,
  w,
  definitionKey,
}) => {
  if (element)
    return (
      <FormControl isInvalid={error && touched} isRequired={isRequired} isDisabled={isDisabled}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
          {label}
        </FormLabel>
        {element}
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    );

  return (
    <FormControl isInvalid={error && touched} isRequired={isRequired} isDisabled={isDisabled}>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {label}
        <ConfigurationFieldExplanation definitionKey={definitionKey} />
      </FormLabel>
      {unit ? (
        <InputGroup>
          <NumberInput
            allowMouseWheel
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            borderRadius="15px"
            fontSize="sm"
            w={w}
            _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          >
            <NumberInputField />
            <NumberInputStepper hidden={hideArrows}>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <InputRightAddon>{unit}</InputRightAddon>
        </InputGroup>
      ) : (
        <NumberInput
          allowMouseWheel
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          borderRadius="15px"
          fontSize="sm"
          w={w}
        >
          <NumberInputField />
          <NumberInputStepper hidden={hideArrows}>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

FastNumberInput.propTypes = propTypes;
FastNumberInput.defaultProps = defaultProps;

export default React.memo(FastNumberInput);
