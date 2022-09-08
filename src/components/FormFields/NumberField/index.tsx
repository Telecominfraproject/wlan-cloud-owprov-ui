import React, { useCallback } from 'react';
import useFastField from 'hooks/useFastField';
import { FieldProps } from 'models/Form';
import Field from './NumberInput';

const parseToInt = (val: string, acceptEmptyValue: boolean) => {
  if (acceptEmptyValue && val === '') return undefined;

  const parsed = parseInt(val, 10);
  if (Number.isNaN(parsed)) return 0;
  return parsed;
};

interface Props extends FieldProps {
  unit?: string;
  hideArrows?: boolean;
  acceptEmptyValue?: boolean;
  w?: string | number;
  conversionFactor?: number;
}

const NumberField: React.FC<Props> = ({
  name,
  unit,
  isDisabled = false,
  label,
  isRequired = false,
  hideArrows = false,
  w,
  acceptEmptyValue = false,
  definitionKey,
  conversionFactor,
}) => {
  const { value, error, isError, onChange, onBlur } = useFastField<number | string | undefined>({
    name,
  });

  const onFieldChange = useCallback(
    (v: string) => {
      if (conversionFactor) {
        const parsed = parseToInt(v, acceptEmptyValue);
        const num = parsed !== undefined ? parsed * conversionFactor : undefined;
        onChange(num);
      } else {
        onChange(parseToInt(v, acceptEmptyValue));
      }
    },
    [onChange],
  );

  return (
    <Field
      label={label ?? name}
      value={conversionFactor ? Math.ceil(value / conversionFactor) : value}
      unit={unit}
      isError={isError}
      onChange={onFieldChange}
      onBlur={onBlur}
      error={error}
      hideArrows={hideArrows}
      isRequired={isRequired}
      isDisabled={isDisabled}
      w={w}
      definitionKey={definitionKey}
    />
  );
};

export default React.memo(NumberField);
