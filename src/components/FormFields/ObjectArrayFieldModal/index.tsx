import React, { useCallback } from 'react';
import useFastField from 'hooks/useFastField';
import { FieldProps } from 'models/Form';
import { Column } from 'models/Table';
// eslint-disable-next-line import/no-cycle
import ObjectArrayFieldInput from './Input';

export interface ObjectArrayFieldModalOptions {
  buttonLabel?: string;
  modalTitle?: string;
}

interface Props extends FieldProps {
  fields: React.ReactNode;
  columns: Column[];
  options?: ObjectArrayFieldModalOptions;
  schema: (t: (e: string) => string, useDefault?: boolean) => object;
}

const ObjectArrayFieldModal: React.FC<Props> = ({
  name,
  label,
  fields,
  schema,
  columns,
  hideLabel = false,
  isDisabled = false,
  isHidden = false,
  isRequired = false,
  emptyIsUndefined = false,
  definitionKey,
  options = {},
}) => {
  const { value, error, isError, onChange, onBlur } = useFastField<unknown[] | undefined>({ name });

  const onFieldChange = useCallback(
    (v: unknown[]) => {
      if (emptyIsUndefined && v.length === 0) onChange(undefined);
      else onChange(v);
    },
    [onChange],
  );

  return (
    <ObjectArrayFieldInput
      name={name}
      label={label ?? name}
      value={value}
      fields={fields}
      schema={schema}
      columns={columns}
      hideLabel={hideLabel}
      onChange={onFieldChange}
      isHidden={isHidden}
      onBlur={onBlur}
      isError={isError}
      error={error}
      isRequired={isRequired}
      isDisabled={isDisabled}
      definitionKey={definitionKey}
      options={options}
    />
  );
};

export default React.memo(ObjectArrayFieldModal);
