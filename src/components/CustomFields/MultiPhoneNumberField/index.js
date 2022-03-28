import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import MultiPhoneNumberFieldInput from './MultiPhoneNumberFieldInput';

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  emptyIsUndefined: PropTypes.bool,
};

const defaultProps = {
  isDisabled: false,
  isRequired: false,
  emptyIsUndefined: false,
};

const MultiPhoneNumberField = ({ name, label, isDisabled, isRequired, emptyIsUndefined }) => {
  const [{ value }, { error, touched }, { setValue, setTouched }] = useField(name);

  const onChange = useCallback((opts) => {
    if (emptyIsUndefined && opts.length === 0) setValue(undefined);
    else setValue(opts.map((opt) => opt.value));
    setTouched(true);
  }, []);

  const onFieldBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return (
    <MultiPhoneNumberFieldInput
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onFieldBlur}
      error={error}
      touched={touched}
      isDisabled={isDisabled}
      isRequired={isRequired}
    />
  );
};

MultiPhoneNumberField.propTypes = propTypes;
MultiPhoneNumberField.defaultProps = defaultProps;
export default MultiPhoneNumberField;
