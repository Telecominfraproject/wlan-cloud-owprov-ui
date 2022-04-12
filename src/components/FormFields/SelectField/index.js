import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import Field from './FastSelectInput';

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
  onChangeEffect: PropTypes.func,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isHidden: PropTypes.bool,
  isInt: PropTypes.bool,
  emptyIsUndefined: PropTypes.bool,
  w: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  definitionKey: PropTypes.string,
};

const defaultProps = {
  onChangeEffect: () => {},
  isRequired: false,
  isDisabled: false,
  isHidden: false,
  emptyIsUndefined: false,
  isInt: false,
  w: undefined,
  definitionKey: null,
};

const SelectField = ({
  options,
  name,
  isDisabled,
  label,
  isRequired,
  onChangeEffect,
  isHidden,
  emptyIsUndefined,
  isInt,
  w,
  definitionKey,
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);

  const onChange = useCallback((e) => {
    if (emptyIsUndefined && e.target.value === '') {
      setValue(undefined);
    } else {
      setValue(isInt ? parseInt(e.target.value, 10) : e.target.value);
    }
    onChangeEffect(e);
    setTimeout(() => {
      setTouched(true);
    }, 200);
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
      options={options}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isHidden={isHidden}
      w={w}
      definitionKey={definitionKey}
    />
  );
};

SelectField.propTypes = propTypes;
SelectField.defaultProps = defaultProps;

export default React.memo(SelectField);
