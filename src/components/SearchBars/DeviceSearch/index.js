import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';
import { Heading } from '@chakra-ui/react';
import useWebSocket from 'hooks/useWebSocket';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};
const defaultProps = {
  isDisabled: false,
};

const DeviceSearchBar = ({ onClick, isDisabled }) => {
  const { t } = useTranslation();
  const { inputValue, results, onInputChange, isConnected, resetSearch } = useWebSocket({
    command: 'serial_number_search',
    paramKey: 'serial_prefix',
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

  const changeDevice = (v) => {
    resetSearch();
    onClick(v.value);
  };

  const onChange = (v) => {
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
      options={results.map((v) => ({ label: v, value: v }))}
      filterOption={() => true}
      inputValue={inputValue}
      value={inputValue}
      placeholder={t('common.search')}
      onInputChange={onChange}
      onChange={changeDevice}
      isDisabled={isDisabled || !isConnected}
    />
  );
};

DeviceSearchBar.propTypes = propTypes;
DeviceSearchBar.defaultProps = defaultProps;
export default DeviceSearchBar;
