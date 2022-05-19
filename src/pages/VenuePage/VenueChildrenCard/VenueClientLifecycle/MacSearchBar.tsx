import { Heading } from '@chakra-ui/react';
import { Select, SingleValue } from 'chakra-react-select';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MacSearchBar: React.FC<{ macs?: string[]; setMac: React.Dispatch<React.SetStateAction<string | undefined>> }> = ({
  macs,
  setMac,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const NoOptionsMessage = useCallback(
    () => (
      <Heading size="sm" textAlign="center">
        {t('common.no_clients_found')}
      </Heading>
    ),
    [t],
  );

  const filter = useCallback(
    (option: { label: string; value: string }, str: string) => option.value.includes(str),
    [macs],
  );

  const onMacSelect = (mac: SingleValue<string>) => {
    // @ts-ignore
    if (mac) setMac(mac.value);
  };

  const handleInputChange = (v: string) => {
    setInputValue(v);
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
      options={macs?.map((v: string) => ({ label: v, value: v })) ?? []}
      filterOption={filter}
      inputValue={inputValue}
      value={inputValue}
      placeholder={t('common.search')}
      onInputChange={handleInputChange}
      onChange={onMacSelect}
      isDisabled={!macs}
    />
  );
};

export default MacSearchBar;
