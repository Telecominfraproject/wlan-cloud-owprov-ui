import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import Field from './FastNumberInput';

const parseToInt = (val, acceptEmptyValue) => {
  if (acceptEmptyValue && val === '') return undefined;

  const parsed = parseInt(val, 10);
  if (Number.isNaN(parsed)) return 0;
  return parsed;
};

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  isDisabled: PropTypes.bool,
  hideButton: PropTypes.bool,
  isRequired: PropTypes.bool,
  hideArrows: PropTypes.bool,
  acceptEmptyValue: PropTypes.bool,
  w: PropTypes.number,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  unit: null,
  isRequired: false,
  hideArrows: false,
  isDisabled: false,
  hideButton: false,
  w: undefined,
  acceptEmptyValue: false,
  definitionKey: null,
};

const NumberField = ({
  name,
  unit,
  isDisabled,
  label,
  hideButton,
  isRequired,
  hideArrows,
  w,
  acceptEmptyValue,
  definitionKey,
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);

  const onChange = useCallback((v) => {
    setValue(parseToInt(v, acceptEmptyValue));
    setTouched(true);
  }, []);

  const onFieldBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return (
    <Field
      label={label}
      value={value}
      unit={unit}
      onChange={onChange}
      onBlur={onFieldBlur}
      error={error}
      hideArrows={hideArrows}
      touched={touched}
      hideButton={hideButton}
      isRequired={isRequired}
      isDisabled={isDisabled}
      w={w}
      definitionKey={definitionKey}
    />
  );
};

NumberField.propTypes = propTypes;
NumberField.defaultProps = defaultProps;

export default React.memo(NumberField);
