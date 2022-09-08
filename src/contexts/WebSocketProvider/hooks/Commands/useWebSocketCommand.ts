import { useCallback, useEffect, useMemo, useState } from 'react';
import { randomIntId } from 'utils/stringHelper';
import { useGlobalWebSocket } from '../..';
import { WebSocketCommandResponse } from '../../useSocketReducer';

const useWebSocketCommand = ({ callback }: { callback: (command: WebSocketCommandResponse) => void }) => {
  const { isOpen, webSocket, lastMessage } = useGlobalWebSocket();
  const [waitingCommands, setWaitingCommands] = useState<number[]>([]);

  const send = useCallback(
    (data) => {
      if (isOpen && webSocket) {
        const id = randomIntId();
        setWaitingCommands([...waitingCommands, id]);
        const toSend = { ...data, id };
        webSocket.send(JSON.stringify(toSend));
      }
    },
    [isOpen, webSocket, waitingCommands],
  );

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'COMMAND') {
      if (waitingCommands.includes(lastMessage.id)) callback(lastMessage);
    }
  }, [lastMessage, waitingCommands]);

  const toReturn = useMemo(
    () => ({
      isOpen,
      send,
    }),
    [send],
  );

  return toReturn;
};

export default useWebSocketCommand;
