import { StringMap, TOptions } from 'i18next';
import { WebSocketNotification } from 'models/WebSocket';

export const acceptedNotificationTypes = ['venue_configuration_update', 'entity_configuration_update'];

type ResponseReturn =
  | undefined
  | { type: 'NOTIFICATION'; notification: WebSocketNotification }
  | {
      type: 'COMMAND';
      data: {
        command_response_id: number;
        response: Record<string, unknown>;
      };
    };
export const extractWebSocketResponse = (message: MessageEvent): ResponseReturn => {
  try {
    const data = JSON.parse(message.data);
    if (data.notification && acceptedNotificationTypes.includes(data.notification.type)) {
      const notification = data.notification as WebSocketNotification;
      return { notification, type: 'NOTIFICATION' };
    }
    if (data.command_response_id) {
      return { data, type: 'COMMAND' } as {
        type: 'COMMAND';
        data: {
          command_response_id: number;
          response: Record<string, unknown>;
        };
      };
    }
  } catch {
    return undefined;
  }
  return undefined;
};

export const getStatusFromNotification = (notification: WebSocketNotification) => {
  let status: 'success' | 'warning' | 'error' = 'success';
  if (notification.content.warning?.length > 0) status = 'warning';
  if (notification.content.error?.length > 0) status = 'error';

  return status;
};

export const getNotificationDescription = (
  t: (key: string, options?: string | TOptions<StringMap> | undefined) => string,
  notification: WebSocketNotification,
) => {
  if (
    notification.content.type === 'venue_configuration_update' ||
    notification.content.type === 'entity_configuration_update'
  ) {
    return t('configurations.notification_details', {
      success: notification.content.success.length,
      warning: notification.content.warning.length,
      error: notification.content.error.length,
    });
  }
  return notification.content.details;
};
