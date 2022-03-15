import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormErrorMessage, FormLabel, Select } from '@chakra-ui/react';
import { v4 as createUuid } from 'uuid';
import isEqual from 'react-fast-compare';
import ConfigurationFieldExplanation from '../ConfigurationFieldExplanation';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  touched: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isHidden: PropTypes.bool,
  w: PropTypes.number,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  value: '',
  error: false,
  touched: false,
  isRequired: false,
  isDisabled: false,
  isHidden: false,
  w: undefined,
  definitionKey: null,
};

const FastSelectInput = ({
  options,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  isRequired,
  isDisabled,
  isHidden,
  w,
  definitionKey,
}) => (
  <FormControl
    isInvalid={error && touched}
    isRequired={isRequired}
    isDisabled={isDisabled}
    hidden={isHidden}
  >
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label} <ConfigurationFieldExplanation definitionKey={definitionKey} />
    </FormLabel>
    <Select
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      borderRadius="15px"
      fontSize="sm"
      _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
      w={w}
    >
      {options.map((option) => (
        <option value={option.value} key={createUuid()}>
          {option.label}
        </option>
      ))}
    </Select>
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);

FastSelectInput.propTypes = propTypes;
FastSelectInput.defaultProps = defaultProps;

export default React.memo(FastSelectInput, isEqual);
