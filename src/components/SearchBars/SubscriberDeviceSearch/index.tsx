import React, { useCallback } from 'react';
import { Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';
import { Heading } from '@chakra-ui/react';
import useDeviceSearch from 'contexts/WebSocketProvider/hooks/Commands/useDeviceSearch';

interface Props {
  onClick: ({ id, operatorId }: { id: string; operatorId: string }) => void;
  operatorId: string;
  isDisabled?: boolean;
}
const defaultProps = {
  isDisabled: false,
};

const SubscriberDeviceSearch: React.FC<Props> = ({ operatorId, onClick, isDisabled }) => {
  const { t } = useTranslation();
  const { inputValue, results, onInputChange, isOpen, resetSearch } = useDeviceSearch({
    minLength: 2,
    operatorId,
  });

  const NoOptionsMessage = useCallback(
    () => (
      <Heading size="sm" textAlign="center">
        {t('common.no_devices_found')}
      </Heading>
    ),
    [],
  );

  const changeDevice = ({ value }: { value: string }) => {
    resetSearch();
    onClick({ id: value, operatorId });
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

SubscriberDeviceSearch.defaultProps = defaultProps;
export default SubscriberDeviceSearch;
