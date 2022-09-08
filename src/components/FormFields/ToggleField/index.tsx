import React, { useCallback } from 'react';
import useFastField from 'hooks/useFastField';
import { FieldProps } from 'models/Form';
import Field from './FastToggleInput';

interface Props extends FieldProps {
  falseIsUndefined?: boolean;
  onChangeCallback?: (e: boolean) => void;
  defaultValue?: boolean;
}

const ToggleField: React.FC<Props> = ({
  name,
  isDisabled = false,
  label,
  isRequired = false,
  defaultValue,
  element,
  falseIsUndefined,
  definitionKey,
  onChangeCallback,
}) => {
  const { value, error, isError, onChange, onBlur } = useFastField<boolean | undefined>({ name });

  const onValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (falseIsUndefined && !e.target.checked) onChange(undefined);
      else onChange(e.target.checked);
      if (onChangeCallback) onChangeCallback(e.target.checked);
    },
    [onChangeCallback],
  );

  return (
    <Field
      label={label ?? name}
      value={value === undefined && defaultValue !== undefined ? defaultValue : value !== undefined && value}
      onChange={onValueChange}
      error={error}
      onBlur={onBlur}
      isError={isError}
      isDisabled={isDisabled}
      isRequired={isRequired}
      element={element}
      definitionKey={definitionKey}
    />
  );
};

export default React.memo(ToggleField);
