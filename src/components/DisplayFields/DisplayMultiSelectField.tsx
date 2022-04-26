import React from 'react';
import { FormControl, FormLabel, LayoutProps, SpaceProps } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';

interface Props extends LayoutProps, SpaceProps {
  label: string;
  value: string[] | number[];
  isRequired?: boolean;
  options: { value: string; label: string }[];
  isPortal?: boolean;
}

const defaultProps = {
  isPortal: false,
  isRequired: false,
};

const DisplayMultiSelectField: React.FC<Props> = ({ label, value, isRequired, options, isPortal, ...props }) => {
  const { t } = useTranslation();

  return (
    <FormControl isRequired={isRequired} isDisabled>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
        {label}
      </FormLabel>
      <Select
        chakraStyles={{
          control: (provided: object, { isDisabled: isControlDisabled }: { isDisabled: boolean }) => ({
            ...provided,
            borderRadius: '15px',
            opacity: isControlDisabled ? '0.8 !important' : '1',
          }),
          dropdownIndicator: (provided: object) => ({
            ...provided,
            backgroundColor: 'unset',
            border: 'unset',
          }),
        }}
        classNamePrefix={isPortal ? 'chakra-react-select' : ''}
        menuPortalTarget={isPortal ? document.body : undefined}
        isMulti
        closeMenuOnSelect={false}
        options={options}
        {...props}
        value={
          value?.map((val) => {
            if (val === '*') return { value: val, label: t('common.all') };
            return options.find((opt) => opt.value === val);
          }) ?? []
        }
        isDisabled
      />
    </FormControl>
  );
};

DisplayMultiSelectField.defaultProps = defaultProps;
export default DisplayMultiSelectField;
