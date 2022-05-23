import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'utils/debounce';
import { WebSocketCommandResponse } from '../../useSocketReducer';
import useWebSocketCommand from './useWebSocketCommand';

interface Props {
  minLength?: number;
}

const useLocationSearch = ({ minLength = 8 }: Props) => {
  const [tempValue, setTempValue] = useState('');
  const [waitingSearch, setWaitingSearch] = useState<{ command: string; address: string } | undefined>(undefined);
  const [results, setResults] = useState<string[]>([]);
  const onNewResult = (newResult: WebSocketCommandResponse) => {
    if (newResult.response.results) setResults(newResult.response.results as string[]);
  };
  const { isOpen, send } = useWebSocketCommand({ callback: onNewResult });

  const onChange = useCallback(
    (v) => {
      if (v.length >= minLength) setWaitingSearch({ command: 'address_completion', address: v });
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

  const resetSearch = () => {
    setResults([]);
    setTempValue('');
  };

  useEffect(() => {
    if (waitingSearch) {
      send(waitingSearch);
    }
  }, [waitingSearch, isOpen]);

  const toReturn = useMemo(
    () => ({ inputValue: tempValue, results, onInputChange, isOpen, resetSearch }),
    [tempValue, results, onInputChange, isOpen],
  );

  return toReturn;
};

export default useLocationSearch;
