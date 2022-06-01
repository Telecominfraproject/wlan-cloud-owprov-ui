import React, { useCallback } from 'react';
import useFastField from 'hooks/useFastField';
import { FieldProps } from 'models/Form';
import Field from './FastToggleInput';

interface Props extends FieldProps {
  defaultValue: object;
  fieldsToDestroy?: string[];
}

const ConfigurationSubSectionToggle: React.FC<Props> = ({
  name,
  isDisabled = false,
  label,
  defaultValue,
  isRequired = false,
  definitionKey,
  fieldsToDestroy,
}) => {
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
