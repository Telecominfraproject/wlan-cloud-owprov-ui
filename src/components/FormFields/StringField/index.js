import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import Field from './FastStringInput';

const propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  hideButton: PropTypes.bool,
  isRequired: PropTypes.bool,
  element: PropTypes.node,
  isArea: PropTypes.bool,
  emptyIsUndefined: PropTypes.bool,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  isRequired: false,
  isDisabled: false,
  hideButton: false,
  isArea: false,
  emptyIsUndefined: false,
  element: null,
  definitionKey: null,
};

const StringField = ({
  name,
  isDisabled,
  label,
  hideButton,
  isRequired,
  element,
  isArea,
  emptyIsUndefined,
  definitionKey,
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);

  const onChange = useCallback((e) => {
    if (emptyIsUndefined && e.target.value === '') setValue(undefined);
    else setValue(e.target.value);
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
      hideButton={hideButton}
      isRequired={isRequired}
      element={element}
      isArea={isArea}
      isDisabled={isDisabled}
      definitionKey={definitionKey}
    />
  );
};

StringField.propTypes = propTypes;
StringField.defaultProps = defaultProps;

export default React.memo(StringField);
