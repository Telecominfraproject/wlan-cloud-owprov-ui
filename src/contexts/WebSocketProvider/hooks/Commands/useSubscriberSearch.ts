import { Subscriber } from 'models/Subscriber';
import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'utils/debounce';
import { WebSocketCommandResponse } from '../../useSocketReducer';
import useWebSocketCommand from './useWebSocketCommand';

interface Props {
  minLength?: number;
  operatorId: string;
  mode: 'nameSearch' | 'emailSearch';
}
const useSubscriberSearch = ({ minLength = 4, operatorId, mode }: Props) => {
  const [tempValue, setTempValue] = useState('');
  const [waitingSearch, setWaitingSearch] = useState<
    { command: string; emailSearch?: string; nameSearch?: string; operatorId?: string } | undefined
  >(undefined);
  const [results, setResults] = useState<Subscriber[]>([]);
  const onNewResult = (newResult: WebSocketCommandResponse) => {
    if (newResult.response.users) setResults(newResult.response.users as Subscriber[]);
  };
  const { isOpen, send } = useWebSocketCommand({ callback: onNewResult });

  const onChange = useCallback(
    (v) => {
      if (v.length >= minLength)
        setWaitingSearch({
          command: 'subuser_search',
          emailSearch: mode === 'emailSearch' ? v : undefined,
          nameSearch: mode === 'nameSearch' ? v : undefined,
          operatorId,
        });
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

export default useSubscriberSearch;
