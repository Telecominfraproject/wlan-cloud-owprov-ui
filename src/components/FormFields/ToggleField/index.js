import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import Field from './FastToggleInput';

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  falseIsUndefined: PropTypes.bool,
  element: PropTypes.node,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  isRequired: false,
  isDisabled: false,
  falseIsUndefined: false,
  element: null,
  definitionKey: null,
};

const ToggleField = ({
  name,
  isDisabled,
  label,
  isRequired,
  element,
  falseIsUndefined,
  definitionKey,
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);

  const onChange = useCallback((e) => {
    if (falseIsUndefined && !e.target.checked) setValue(undefined);
    else setValue(e.target.checked);
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
      isDisabled={isDisabled}
      isRequired={isRequired}
      element={element}
      definitionKey={definitionKey}
    />
  );
};

ToggleField.propTypes = propTypes;
ToggleField.defaultProps = defaultProps;

export default React.memo(ToggleField);
