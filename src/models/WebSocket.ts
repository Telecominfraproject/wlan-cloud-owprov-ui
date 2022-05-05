export interface WebSocketNotification {
  notification_id: number;
  content: {
    type: 'venue_configuration_update' | 'entity_configuration_update';
    title: string;
    details: string;
    success: string[];
    warning: string[];
    error: string[];
    timeStamp: number;
  };
}

export interface WebSocketResponse {
  notification?: WebSocketNotification;
}
