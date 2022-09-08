import { WebSocketNotification } from 'models/WebSocket';
import { useReducer } from 'react';

export type WebSocketCommandResponse = {
  type: 'COMMAND';
  timestamp: Date;
  id: number;
  response: Record<string, unknown>;
};

export type WebSocketMessage =
  | {
      type: 'NOTIFICATION';
      data: WebSocketNotification;
      timestamp: Date;
    }
  | WebSocketCommandResponse
  | { type: 'UNKNOWN'; data: unknown; timestamp: Date };

type Action =
  | { type: 'NEW_NOTIFICATION'; notification: WebSocketNotification }
  | {
      type: 'NEW_COMMAND';
      data: { command_response_id: number; response: Record<string, unknown> };
    }
  | { type: 'UNKNOWN'; newMessage: unknown };

interface ReducerState {
  lastMessage?: WebSocketMessage;
  allMessages: WebSocketMessage[];
}

const reducer = (state: ReducerState, action: Action): ReducerState => {
  switch (action.type) {
    case 'NEW_NOTIFICATION': {
      const obj: WebSocketMessage = { type: 'NOTIFICATION', data: action.notification, timestamp: new Date() };
      return { allMessages: [...state.allMessages, obj], lastMessage: obj };
    }
    case 'NEW_COMMAND': {
      const obj: WebSocketMessage = {
        type: 'COMMAND',
        response: action.data.response,
        timestamp: new Date(),
        id: action.data.command_response_id,
      };
      return { allMessages: [...state.allMessages, obj], lastMessage: obj };
    }
    case 'UNKNOWN': {
      const obj: WebSocketMessage = { type: 'UNKNOWN', data: action.newMessage, timestamp: new Date() };
      return {
        allMessages: [...state.allMessages, obj],
        lastMessage: obj,
      };
    }
    default:
      throw new Error();
  }
};

const useSocketReducer = () => {
  const [{ allMessages, lastMessage }, dispatch] = useReducer(reducer, { allMessages: [] });

  return { allMessages, lastMessage, dispatch };
};

export default useSocketReducer;
