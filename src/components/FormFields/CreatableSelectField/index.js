import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import Field from './FastCreatableSelectInput';

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isHidden: PropTypes.bool,
  emptyIsUndefined: PropTypes.bool,
  placeholder: PropTypes.string,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  isRequired: false,
  isDisabled: false,
  isHidden: false,
  emptyIsUndefined: false,
  placeholder: '',
  definitionKey: null,
};

const CreatableSelectField = ({
  name,
  isDisabled,
  label,
  isRequired,
  isHidden,
  emptyIsUndefined,
  placeholder,
  definitionKey,
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);

  const onChange = useCallback((opts) => {
    if (emptyIsUndefined && opts.length === 0) setValue(undefined);
    else setValue(opts.map((opt) => opt.value));
    setTouched(true);
  }, []);

  const onFieldBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return (
    <Field
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onFieldBlur}
      error={error}
      touched={touched}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isHidden={isHidden}
      definitionKey={definitionKey}
    />
  );
};

CreatableSelectField.propTypes = propTypes;
CreatableSelectField.defaultProps = defaultProps;

export default React.memo(CreatableSelectField);
