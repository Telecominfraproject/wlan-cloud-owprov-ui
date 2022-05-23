import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'utils/debounce';
import { WebSocketCommandResponse } from '../../useSocketReducer';
import useWebSocketCommand from './useWebSocketCommand';

interface Props {
  minLength?: number;
  operatorId?: string;
}
const useDeviceSearch = ({ minLength = 4, operatorId }: Props) => {
  const [tempValue, setTempValue] = useState('');
  const [waitingSearch, setWaitingSearch] = useState<
    { command: string; serial_prefix: string; operatorId?: string } | undefined
  >(undefined);
  const [results, setResults] = useState<string[]>([]);
  const onNewResult = (newResult: WebSocketCommandResponse) => {
    if (newResult.response.serialNumbers) setResults(newResult.response.serialNumbers as string[]);
  };
  const { isOpen, send } = useWebSocketCommand({ callback: onNewResult });

  const onChange = useCallback(
    (v) => {
      if (v.length >= minLength) setWaitingSearch({ command: 'serial_number_search', serial_prefix: v, operatorId });
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

export default useDeviceSearch;
