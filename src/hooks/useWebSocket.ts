import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'utils/debounce';
import { isJson } from 'utils/formatTests';
import { randomIntId } from 'utils/stringHelper';
import { axiosProv, axiosSec } from 'utils/axiosInstances';

const commandsResultType: Record<
  'serial_number_search' | 'address_completion' | 'subuser_search' | 'subdevice_search',
  'array' | 'object' | 'users' | 'serialNumbers'
> = {
  serial_number_search: 'array',
  address_completion: 'object',
  subuser_search: 'users',
  subdevice_search: 'serialNumbers',
};

interface Props {
  command: 'serial_number_search' | 'address_completion' | 'subuser_search' | 'subdevice_search';
  paramKey: string;
  resultKey?: string;
  minLength?: number;
  operatorId?: string;
}

const useWebSocket = ({ command, paramKey, resultKey, minLength = 4, ...props }: Props) => {
  const [tempValue, setTempValue] = useState('');
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [results, setResults] = useState<unknown[]>([]);
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

  const search = (value: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      if (value.length >= minLength) {
        setWaitingSearch('');
        const params = { command, id: randomIntId(), [paramKey]: value, ...props };
        socket.send(JSON.stringify(params));
      } else {
        setResults([]);
      }
    } else {
      setWaitingSearch(value);
    }
  };

  const closeSocket = () => {
    if (socket) {
      socket.close();
    }
  };

  const resetSearch = () => {
    setResults([]);
    setTempValue('');
  };

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        socket.send(
          `token:${
            axiosSec?.defaults?.headers?.common?.Authorization
              ? axiosSec.defaults.headers.common.Authorization.split(' ')[1]
              : ''
          }`,
        );
      };

      socket.onmessage = (event) => {
        if (isJson(event.data)) {
          const result = JSON.parse(event.data);
          if (commandsResultType[command] === 'array' && result?.response) setResults(result.response);
          if (commandsResultType[command] === 'object' && result?.response?.results)
            setResults(result.response.results);
          if (commandsResultType[command] === 'users') setResults(result.response.users);
          if (commandsResultType[command] === 'serialNumbers') setResults(result.response.serialNumbers);
        }
      };
    }

    return () => closeSocket();
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      setSocket(
        new WebSocket(`${axiosProv?.defaults?.baseURL ? axiosProv.defaults.baseURL.replace('https', 'wss') : ''}/ws`),
      );
    }
  }, []);

  useEffect(() => {
    if (waitingSearch.length >= minLength) {
      search(waitingSearch);
    }
  }, [socket, waitingSearch]);

  const isConnected = useMemo(() => socket !== undefined, [socket]);

  const toReturn = useMemo(
    () => ({ inputValue: tempValue, results, onInputChange, isConnected, resetSearch }),
    [tempValue, results, onInputChange, isConnected],
  );

  return toReturn;
};

export default useWebSocket;
