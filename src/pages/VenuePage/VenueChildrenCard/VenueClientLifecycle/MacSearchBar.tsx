import { Heading } from '@chakra-ui/react';
import { ActionMeta, InputActionMeta, Select, SingleValue } from 'chakra-react-select';
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
    (option: { label: string; value: string }, str: string) => option.value.includes(str.replace('*', '')),
    [macs],
  );

  const onMacSelect = (mac: SingleValue<string>, action: ActionMeta<string>) => {
    // @ts-ignore
    if (mac && action.action !== 'menu-close') {
      // @ts-ignore
      setMac(mac.value);
      // @ts-ignore
      setInputValue(mac.value);
    }
  };
  const onFocus = useCallback(() => setInputValue(''), []);

  const handleInputChange = (v: string, action: InputActionMeta) => {
    if (action.action !== 'menu-close' && action.action !== 'input-blur') setInputValue(v);
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
          opacity: '1 !important',
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
      onFocus={onFocus}
      inputValue={inputValue}
      value={inputValue}
      placeholder={t('common.search')}
      onInputChange={handleInputChange}
      onChange={onMacSelect}
      isDisabled={!macs}
      blurInputOnSelect
    />
  );
};

export default MacSearchBar;
