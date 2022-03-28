import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormErrorMessage, FormLabel, Switch } from '@chakra-ui/react';
import ConfigurationFieldExplanation from '../ConfigurationFieldExplanation';

const propTypes = {
  value: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  element: PropTypes.node,
  touched: PropTypes.bool,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  value: false,
  error: false,
  touched: false,
  isRequired: false,
  isDisabled: false,
  element: null,
  definitionKey: null,
};

const FastToggleInput = ({
  element,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  isRequired,
  isDisabled,
  definitionKey,
}) => (
  <FormControl
    isInvalid={error && touched}
    isRequired={isRequired}
    isDisabled={isDisabled}
    _disabled={{ opacity: 0.8 }}
  >
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label} <ConfigurationFieldExplanation definitionKey={definitionKey} />
    </FormLabel>
    {element ?? (
      <Switch
        isChecked={value}
        onChange={onChange}
        onBlur={onBlur}
        borderRadius="15px"
        size="lg"
        isDisabled={isDisabled}
        _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
      />
    )}
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);

FastToggleInput.propTypes = propTypes;
FastToggleInput.defaultProps = defaultProps;

export default React.memo(FastToggleInput);
