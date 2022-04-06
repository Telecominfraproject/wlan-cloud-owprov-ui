import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'utils/debounce';
import { isJson } from 'utils/formatTests';
import { randomIntId } from 'utils/stringHelper';
import { axiosProv, axiosSec } from 'utils/axiosInstances';

const commandsResultType = {
  serial_number_search: 'array',
  address_completion: 'object',
};

const propTypes = {
  command: PropTypes.oneOf(['serial_number_search', 'address_completion']),
  paramKey: PropTypes.string.isRequired,
  minLength: PropTypes.number,
};

const defaultProps = {
  minLength: 4,
};

const useWebSocket = ({ command, paramKey, minLength }) => {
  const [tempValue, setTempValue] = useState('');
  const [socket, setSocket] = useState(null);
  const [results, setResults] = useState([]);
  const [waitingSearch, setWaitingSearch] = useState('');

  const onChange = useCallback(
    (v) => {
      if (v.length >= minLength) setWaitingSearch(v);
    },
    [setWaitingSearch],
  );

  const debounceChange = useCallback(
    debounce((v) => {
      onChange(v);
    }, 300),
    [setWaitingSearch],
  );

  const onInputChange = useCallback(
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
      if (value.length >= minLength) {
        setWaitingSearch('');
        const params = { command, id: randomIntId() };
        params[paramKey] = value;
        socket.send(JSON.stringify(params));
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

  const resetSearch = () => {
    setResults([]);
    setTempValue('');
  };

  useEffect(() => {
    if (socket !== null) {
      socket.onopen = () => {
        socket.send(`token:${axiosSec.defaults.headers.common.Authorization.split(' ')[1]}`);
      };

      socket.onmessage = (event) => {
        if (isJson(event.data)) {
          const result = JSON.parse(event.data);
          if (commandsResultType[command] === 'array' && result?.response) setResults(result.response);
          if (commandsResultType[command] === 'object' && result?.response?.results)
            setResults(result.response.results);
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
    if (waitingSearch.length >= minLength) {
      search(waitingSearch);
    }
  }, [socket, waitingSearch]);

  const isConnected = useMemo(() => socket !== null, [socket]);

  const toReturn = useMemo(
    () => ({ inputValue: tempValue, results, onInputChange, isConnected, resetSearch }),
    [tempValue, results, onInputChange, isConnected],
  );

  return toReturn;
};

useWebSocket.propTypes = propTypes;
useWebSocket.defaultProps = defaultProps;
export default useWebSocket;
