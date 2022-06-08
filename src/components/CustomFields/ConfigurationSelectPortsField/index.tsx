import useFastField from 'hooks/useFastField';
import React, { useMemo } from 'react';
import MultiSelectInput from './Input';

interface Props {
  isDisabled?: boolean;
  name: string;
}

const ConfigurationSelectPortsField: React.FC<Props> = ({ name, isDisabled = false }) => {
  const { value, error, isError, onChange, onBlur } = useFastField<string[] | undefined>({ name });

  const options = useMemo(
    () => [
      {
        value: 'WAN*',
        label: 'WAN*',
      },
      {
        value: 'LAN*',
        label: 'LAN*',
      },
      {
        value: 'WAN1',
        label: 'WAN1',
      },
      {
        value: 'WAN2',
        label: 'WAN2',
      },
      {
        value: 'WAN3',
        label: 'WAN3',
      },
      {
        value: 'WAN4',
        label: 'WAN4',
      },
      {
        value: 'LAN1',
        label: 'LAN1',
      },
      {
        value: 'LAN2',
        label: 'LAN2',
      },
      {
        value: 'LAN3',
        label: 'LAN3',
      },
      {
        value: 'LAN4',
        label: 'LAN4',
      },
      {
        value: 'LAN5',
        label: 'LAN5',
      },
      {
        value: 'LAN6',
        label: 'LAN6',
      },
      {
        value: 'LAN7',
        label: 'LAN7',
      },
      {
        value: 'LAN8',
        label: 'LAN8',
      },
      {
        value: 'LAN9',
        label: 'LAN9',
      },
      {
        value: 'LAN10',
        label: 'LAN10',
      },
      {
        value: 'LAN11',
        label: 'LAN11',
      },
      {
        value: 'LAN12',
        label: 'LAN12',
      },
    ],
    [],
  );

  return (
    <MultiSelectInput
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      options={options}
      error={error}
      isError={isError}
      isDisabled={isDisabled}
    />
  );
};

export default ConfigurationSelectPortsField;
