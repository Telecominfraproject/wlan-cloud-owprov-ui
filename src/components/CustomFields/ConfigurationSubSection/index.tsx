import React, { useCallback } from 'react';
import Field from './FastToggleInput';
import useFastField from 'hooks/useFastField';
import { FieldProps } from 'models/Form';

interface Props extends FieldProps {
  defaultValue: object;
  fieldsToDestroy?: string[];
}

const ConfigurationSubSectionToggle = ({
  name,
  isDisabled = false,
  label,
  defaultValue,
  isRequired = false,
  definitionKey,
  fieldsToDestroy,
}: Props) => {
  const { value, error, isError, onChange, onBlur, setFieldValue } = useFastField<object | undefined>({ name });

  const onValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      onChange(undefined);
      if (fieldsToDestroy) {
        for (const field of fieldsToDestroy) {
          setFieldValue(field, undefined);
        }
      }
    } else onChange(defaultValue);
  }, []);

  return (
    <Field
      label={label ?? name}
      value={value !== undefined}
      onChange={onValueChange}
      error={error}
      onBlur={onBlur}
      isError={isError}
      isDisabled={isDisabled}
      isRequired={isRequired}
      definitionKey={definitionKey}
    />
  );
};

export default React.memo(ConfigurationSubSectionToggle);
