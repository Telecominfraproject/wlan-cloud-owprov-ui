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
import ConfigurationFieldExplanation from 'components/FormFields/ConfigurationFieldExplanation';
import CurrencySelect from './CurrencySelect';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  touched: PropTypes.bool,
  hideArrows: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  w: PropTypes.number,
  definitionKey: PropTypes.string,
  currencyName: PropTypes.string.isRequired,
};

const defaultProps = {
  value: '',
  error: false,
  touched: false,
  isRequired: false,
  hideArrows: false,
  isDisabled: false,
  w: undefined,
  definitionKey: null,
};

const NumberCurrencyInput = ({
  label,
  value,
  onChange,
  error,
  touched,
  isRequired,
  hideArrows,
  isDisabled,
  w,
  definitionKey,
  currencyName,
}) => (
  <FormControl isInvalid={error && touched} isRequired={isRequired} isDisabled={isDisabled}>
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label}
      <ConfigurationFieldExplanation definitionKey={definitionKey} />
    </FormLabel>
    <InputGroup>
      <NumberInput
        allowMouseWheel
        defaultValue={value}
        onBlur={onChange}
        borderRadius="15px"
        fontSize="sm"
        w={w}
        _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        precision={2}
        step={0.2}
      >
        <NumberInputField />
        <NumberInputStepper hidden={hideArrows}>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <InputRightAddon p={0}>
        <CurrencySelect name={currencyName} isDisabled={isDisabled} />
      </InputRightAddon>
    </InputGroup>

    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);

NumberCurrencyInput.propTypes = propTypes;
NumberCurrencyInput.defaultProps = defaultProps;

export default React.memo(NumberCurrencyInput);
