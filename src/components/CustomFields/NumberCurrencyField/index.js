import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import Field from './Input';

const parseToInt = (e, acceptEmptyValue) => {
  const val = e.target.value;
  if (acceptEmptyValue && val === '') return undefined;
  const parsed = parseFloat(val, 100);
  if (Number.isNaN(parsed)) return 0;
  return parsed;
};

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  hideArrows: PropTypes.bool,
  acceptEmptyValue: PropTypes.bool,
  w: PropTypes.number,
  definitionKey: PropTypes.string,
  conversionFactor: PropTypes.number,
  currencyName: PropTypes.string.isRequired,
};

const defaultProps = {
  isRequired: false,
  hideArrows: false,
  isDisabled: false,
  w: undefined,
  acceptEmptyValue: false,
  definitionKey: null,
  conversionFactor: null,
};

const NumberCurrencyField = ({
  name,
  isDisabled,
  label,
  isRequired,
  hideArrows,
  w,
  acceptEmptyValue,
  definitionKey,
  conversionFactor,
  currencyName,
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
      onChange={onChange}
      onBlur={onFieldBlur}
      error={error}
      hideArrows={hideArrows}
      touched={touched}
      isRequired={isRequired}
      isDisabled={isDisabled}
      w={w}
      definitionKey={definitionKey}
      conversionFactor={conversionFactor}
      currencyName={currencyName}
    />
  );
};

NumberCurrencyField.propTypes = propTypes;
NumberCurrencyField.defaultProps = defaultProps;

export default React.memo(NumberCurrencyField);
