import React, { useCallback } from 'react';
import { useField } from 'formik';
import { defaultFormField, FormFieldProps } from 'models/FormField';
import Field from './FastSelectInput';

interface Props extends FormFieldProps {
  options: { label: string; value: string | number }[];
}
const defaultProps = defaultFormField;

const SelectField: React.FC<Props> = ({
  options,
  name,
  isDisabled,
  label,
  isRequired,
  onChange: onCustomChange,
  onChangeEffect,
  isHidden,
  isLabelHidden,
  emptyIsUndefined,
  isInt,
  w,
  definitionKey,
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(name);

  const onChange = useCallback(
    (e) => {
      if (onCustomChange) {
        onCustomChange(e);
      } else {
        if (emptyIsUndefined && e.target.value === '') {
          setValue(undefined);
        } else {
          setValue(isInt ? parseInt(e.target.value, 10) : e.target.value);
        }
        if (onChangeEffect !== undefined) onChangeEffect(e);
        setTimeout(() => {
          setTouched(true);
        }, 200);
      }
    },
    [onCustomChange],
  );

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
      isLabelHidden={isLabelHidden}
      w={w}
      definitionKey={definitionKey}
    />
  );
};

SelectField.defaultProps = defaultProps;

export default React.memo(SelectField);
