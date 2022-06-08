import React, { useCallback } from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { MultiValue, Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';
import ConfigurationFieldExplanation from 'components/FormFields/ConfigurationFieldExplanation';

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
  options: { value: string; label: string }[];
  onBlur: () => void;
  error?: string | boolean;
  isError: boolean;
  isDisabled: boolean;
}

export const WAN_OPTIONS = ['WAN1', 'WAN2', 'WAN3', 'WAN4'];
const lanOptions = ['LAN1', 'LAN2', 'LAN3', 'LAN4', 'LAN5', 'LAN6', 'LAN7', 'LAN8', 'LAN9', 'LAN10', 'LAN11', 'LAN12'];

const MultiSelectInput: React.FC<Props> = ({ value, onChange, onBlur, options, error, isError, isDisabled }) => {
  const { t } = useTranslation();

  const onValueChange = useCallback(
    (
      v: MultiValue<
        | {
            value: string;
            label: string;
          }
        | undefined
      >,
    ) => {
      if (v) {
        let newValue = v;
        const newestValue = newValue.length === 0 ? '' : newValue[newValue.length - 1]?.value ?? '';

        if (WAN_OPTIONS.includes(newestValue)) newValue = newValue.filter((val) => val?.value !== 'WAN*');
        else if (newestValue === 'WAN*') newValue = newValue.filter((val) => !WAN_OPTIONS.includes(val?.value ?? ''));
        if (lanOptions.includes(newestValue)) newValue = newValue.filter((val) => val?.value !== 'LAN*');
        else if (newestValue === 'LAN*') newValue = newValue.filter((val) => !lanOptions.includes(val?.value ?? ''));

        onChange(newValue.map((val) => val?.value ?? ''));
      }
    },
    [],
  );

  return (
    <FormControl isInvalid={isError} isRequired>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        select-ports
        <ConfigurationFieldExplanation definitionKey="interface.ethernet.select-ports" />
      </FormLabel>
      <Select
        chakraStyles={{
          control: (provided, { isDisabled: isControlDisabled }) => ({
            ...provided,
            borderRadius: '15px',
            opacity: isControlDisabled ? '0.8 !important' : '1',
            border: '2px solid',
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            backgroundColor: 'unset',
            border: 'unset',
          }),
        }}
        isMulti
        closeMenuOnSelect={false}
        options={options}
        value={
          value?.map((val) => {
            if (val === '*') return { value: val, label: t('common.all') };
            return options.find((opt) => opt.value === val);
          }) ?? []
        }
        onChange={onValueChange}
        onBlur={onBlur}
        isDisabled={isDisabled}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default React.memo(MultiSelectInput);
