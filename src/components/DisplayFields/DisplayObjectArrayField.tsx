import React from 'react';
import { FormControl, FormLabel, LayoutProps, SpaceProps } from '@chakra-ui/react';
import ObjectArrayFieldInput from 'components/FormFields/ObjectArrayFieldModal/Input';
import { Column } from 'models/Table';

interface ObjectArrayFieldModalOptions {
  buttonLabel?: string;
  modalTitle?: string;
}

interface Props extends LayoutProps, SpaceProps {
  label: string;
  value: object[];
  fields: React.ReactNode;
  columns: Column[];
  options?: ObjectArrayFieldModalOptions;
  isRequired?: boolean;
  isDisabled?: boolean;
  schema: (t: (e: string) => string, useDefault?: boolean) => object;
}

const DisplayObjectArrayField = ({
  label,
  value,
  isRequired = false,
  columns,
  fields,
  schema,
  isDisabled = false,
  options = {},
}: Props) => (
  <FormControl isRequired={isRequired} isDisabled>
    <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
      {label}
    </FormLabel>
    <ObjectArrayFieldInput
      name={label}
      label={label}
      hideLabel
      value={value}
      fields={fields}
      schema={schema}
      columns={columns}
      onChange={() => {}}
      isHidden={false}
      onBlur={() => {}}
      isError={false}
      error={undefined}
      isRequired={isRequired}
      isDisabled={isDisabled}
      options={options}
    />
  </FormControl>
);

export default DisplayObjectArrayField;
