import { useAuth } from 'contexts/AuthProvider';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { axiosProv } from 'utils/axiosInstances';

const WebSocketContext = React.createContext<{
  webSocket: WebSocket | undefined;
  isOpen: boolean;
}>({
  webSocket: undefined,
  isOpen: false,
});

export const WebSocketProvider = ({ children }: { children: React.ReactElement }) => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ws = useRef<WebSocket | undefined>(undefined);

  useEffect(() => {
    ws.current = new WebSocket(
      `${axiosProv?.defaults?.baseURL ? axiosProv.defaults.baseURL.replace('https', 'wss') : ''}/ws`,
    );
    ws.current.onopen = () => {
      setIsOpen(true);
      ws.current?.send(`token:${token}`);
    };
    const wsCurrent = ws.current;
    return () => wsCurrent?.close();
  }, []);

  const values = useMemo(
    () => ({
      webSocket: ws.current,
      isOpen,
    }),
    [ws, isOpen],
  );

  return <WebSocketContext.Provider value={values}>{children}</WebSocketContext.Provider>;
};

export const useGlobalWebSocket = () => React.useContext(WebSocketContext);
