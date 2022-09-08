import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import Field from './FastNumberInput';

const parseToInt = (val) => {
  const parsed = parseInt(val, 10);
  if (Number.isNaN(parsed)) return 0;
  return parsed;
};

const propTypes = {
  name: PropTypes.string.isRequired,
  unitSaved: PropTypes.string,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};

const defaultProps = {
  unit: null,
  unitSaved: '',
  isRequired: false,
  isDisabled: false,
};

const CustomNumberAsStringField = ({ name, unit, unitSaved, isDisabled, label, isRequired }) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);

  const onChange = useCallback((v) => {
    setValue(`${v}${unitSaved}`);
    setTouched(true);
  }, []);

  const onFieldBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return (
    <Field
      label={label}
      value={value ? parseToInt(value.split(unitSaved)[0]) : value}
      unit={unit}
      onChange={onChange}
      onBlur={onFieldBlur}
      error={error}
      touched={touched}
      isRequired={isRequired}
      isDisabled={isDisabled}
    />
  );
};

CustomNumberAsStringField.propTypes = propTypes;
CustomNumberAsStringField.defaultProps = defaultProps;

export default React.memo(CustomNumberAsStringField);
