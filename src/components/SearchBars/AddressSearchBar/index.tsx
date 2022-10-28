import React, { useCallback } from 'react';
import { Heading } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';
import { useLocationSearch } from 'contexts/ProvisioningSocketProvider/hooks/Commands/useLocationSearch';
import { AddressObject, GoogleResult } from 'models/Location';
import formatGoogleAddress from 'utils/formatGoogleAddress';

interface Props {
  onSelect: (obj: AddressObject) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

const AddressSearchBar = ({ onSelect, isDisabled, placeholder = '' }: Props) => {
  const { t } = useTranslation();
  const { inputValue, results, onInputChange, isOpen, resetSearch } = useLocationSearch({});

  const NoOptionsMessage = useCallback(
    () => (
      <Heading size="sm" textAlign="center">
        {t('common.no_addresses_found')}
      </Heading>
    ),
    [],
  );

  const changeAddress = (val: GoogleResult) => {
    const parsedAddress = formatGoogleAddress(val);
    if (parsedAddress) onSelect(parsedAddress);
    resetSearch();
  };

  return (
    <Select
      chakraStyles={{
        control: (provided) => ({
          ...provided,
          borderRadius: '15px',
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          backgroundColor: 'unset',
          border: 'unset',
        }),
      }}
      components={{ NoOptionsMessage }}
      // @ts-ignore
      options={results.map((v) => ({ label: v.formatted_address, value: v }))}
      filterOption={() => true}
      inputValue={inputValue}
      value={inputValue}
      placeholder={placeholder}
      onInputChange={onInputChange}
      onChange={(property) => changeAddress(property as unknown as GoogleResult)}
      isDisabled={isDisabled || !isOpen}
    />
  );
};

export default AddressSearchBar;
