import React, { useCallback } from 'react';
import { Heading } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';
import { useProviderDeviceSearch } from 'contexts/ProvisioningSocketProvider/hooks/Commands/useDeviceSearch';

interface Props {
  onClick: (id: string) => void;
  isDisabled?: boolean;
}

const DeviceSearchBar = ({ onClick, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { inputValue, results, onInputChange, isOpen, resetSearch } = useProviderDeviceSearch({
    minLength: 2,
  });

  const NoOptionsMessage = useCallback(
    () => (
      <Heading size="sm" textAlign="center">
        {t('common.no_devices_found')}
      </Heading>
    ),
    [],
  );

  const changeDevice = (v: { value: string }) => {
    resetSearch();
    onClick(v.value);
  };

  const onChange = (v: string) => {
    if (v.length === 0 || v.match('^[a-fA-F0-9-*]+$')) onInputChange(v);
  };

  return (
    <Select
      chakraStyles={{
        control: (provided) => ({
          ...provided,
          borderRadius: '15px',
          color: 'unset',
        }),
        input: (provided) => ({
          ...provided,
          width: '140px',
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          backgroundColor: 'unset',
          border: 'unset',
        }),
      }}
      components={{ NoOptionsMessage }}
      // @ts-ignore
      options={results.map((v: string) => ({ label: v, value: v }))}
      filterOption={() => true}
      inputValue={inputValue}
      value={inputValue}
      placeholder={t('common.search')}
      onInputChange={onChange}
      // @ts-ignore
      onChange={changeDevice}
      isDisabled={isDisabled || !isOpen}
    />
  );
};
export default DeviceSearchBar;
