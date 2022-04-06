import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'chakra-react-select';
import { useTranslation } from 'react-i18next';
import formatGoogleAddress from 'utils/formatGoogleAddress';
import { isJson } from 'utils/formatTests';
import { axiosProv, axiosSec } from 'utils/axiosInstances';
import debounce from 'utils/debounce';
import { Heading } from '@chakra-ui/react';
import { randomIntId } from 'utils/stringHelper';

const propTypes = {
  onSelect: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  placeholder: PropTypes.string,
};
const defaultProps = {
  isDisabled: false,
  placeholder: '',
};

const AddressSearchBar = ({ onSelect, isDisabled, placeholder }) => {
  const { t } = useTranslation();
  const [tempValue, setTempValue] = useState('');
  const [socket, setSocket] = useState(null);
  const [results, setResults] = useState([]);
  const [waitingSearch, setWaitingSearch] = useState('');

  const NoOptionsMessage = useCallback(
    () => (
      <Heading size="sm" textAlign="center">
        {t('common.no_addresses_found')}
      </Heading>
    ),
    [],
  );

  const changeAddress = (val) => {
    const parsedAddress = formatGoogleAddress(val);
    if (parsedAddress) onSelect(parsedAddress);
  };

  const onChange = useCallback(
    (v) => {
      if (v.length >= 4) setWaitingSearch(v);
    },
    [setWaitingSearch],
  );

  const debounceChange = useCallback(
    debounce((v) => {
      onChange(v);
    }, 300),
    [setWaitingSearch],
  );

  const handleTyping = useCallback(
    (v) => {
      if (v !== tempValue) {
        setTempValue(v);
        debounceChange(v);
      }
    },
    [tempValue, debounceChange, setTempValue, setWaitingSearch],
  );

  const search = (value) => {
    if (socket?.readyState === WebSocket.OPEN) {
      if (value.length > 3) {
        setWaitingSearch('');
        socket.send(JSON.stringify({ command: 'address_completion', address: value, id: randomIntId() }));
      } else {
        setResults([]);
      }
    } else {
      setWaitingSearch(value);
    }
  };

  const closeSocket = () => {
    if (socket !== null) {
      socket.close();
    }
  };

  useEffect(() => {
    if (socket !== null) {
      socket.onopen = () => {
        socket.send(`token:${axiosSec.defaults.headers.common.Authorization.split(' ')[1]}`);
      };

      socket.onmessage = (event) => {
        if (isJson(event.data)) {
          const result = JSON.parse(event.data);
          if (result?.response?.results) {
            setResults(result?.response?.results);
          }
        }
      };
    }

    return () => closeSocket();
  }, [socket]);

  useEffect(() => {
    if (socket === null) {
      setSocket(new WebSocket(`${axiosProv.defaults.baseURL.replace('https', 'wss')}/ws`));
    }
  }, []);

  useEffect(() => {
    if (waitingSearch.length >= 3) {
      search(waitingSearch);
    }
  }, [socket, waitingSearch]);

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
      options={results.map((v) => ({ label: v.formatted_address, value: v }))}
      filterOption={() => true}
      inputValue={tempValue}
      value={tempValue}
      placeholder={placeholder}
      onInputChange={handleTyping}
      onChange={(property) => changeAddress(property)}
      isDisabled={isDisabled || socket === null}
    />
  );
};

AddressSearchBar.propTypes = propTypes;
AddressSearchBar.defaultProps = defaultProps;
export default AddressSearchBar;
