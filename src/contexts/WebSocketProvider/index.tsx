import { useAuth } from 'contexts/AuthProvider';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { axiosProv } from 'utils/axiosInstances';
import useSocketReducer, { WebSocketMessage } from './useSocketReducer';
import useWebSocketNotification from './hooks/NotificationContent/useWebSocketNotification';
import { extractWebSocketResponse } from './utils';

const WebSocketContext = React.createContext<{
  webSocket: WebSocket | undefined;
  isOpen: boolean;
  lastMessage?: WebSocketMessage | undefined;
  allMessages: WebSocketMessage[];
}>({
  webSocket: undefined,
  isOpen: false,
  allMessages: [],
});

export const WebSocketProvider = ({ children }: { children: React.ReactElement }) => {
  const { token, isUserLoaded } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ws = useRef<WebSocket | undefined>(undefined);
  const { allMessages, lastMessage, dispatch } = useSocketReducer();
  const { pushNotification, modal } = useWebSocketNotification();

  const onMessage = useCallback((message: MessageEvent) => {
    const result = extractWebSocketResponse(message);
    if (result?.type === 'NOTIFICATION') {
      dispatch({ type: 'NEW_NOTIFICATION', notification: result.notification });
      pushNotification(result.notification);
    }
    if (result?.type === 'COMMAND') {
      dispatch({ type: 'NEW_COMMAND', data: result.data });
    }
  }, []);

  const onStartWebSocket = () => {
    ws.current = new WebSocket(
      `${axiosProv?.defaults?.baseURL ? axiosProv.defaults.baseURL.replace('https', 'wss') : ''}/ws`,
    );
    ws.current.onopen = () => {
      setIsOpen(true);
      ws.current?.send(`token:${token}`);
    };
    ws.current.onclose = () => {
      setIsOpen(false);
      setTimeout(onStartWebSocket, 3000);
    };
    ws.current.onerror = () => {
      setIsOpen(false);
    };
  };

  // useEffect for created the WebSocket and 'storing' it in useRef
  useEffect(() => {
    if (isUserLoaded) {
      onStartWebSocket();
    }

    const wsCurrent = ws?.current;
    return () => wsCurrent?.close();
  }, [isUserLoaded]);

  // useEffect for generating global notifications
  useEffect(() => {
    if (ws?.current) {
      ws.current.addEventListener('message', onMessage);
    }

    const wsCurrent = ws?.current;
    return () => {
      if (wsCurrent) wsCurrent.removeEventListener('message', onMessage);
    };
  }, [ws?.current]);
  const values = useMemo(
    () => ({
      allMessages,
      lastMessage,
      webSocket: ws.current,
      isOpen,
    }),
    [ws, isOpen, allMessages, lastMessage],
  );

  return (
    <WebSocketContext.Provider value={values}>
      <>
        {children}
        {modal}
      </>
    </WebSocketContext.Provider>
  );
};

export const useGlobalWebSocket = () => React.useContext(WebSocketContext);
