import { WebSocketNotification } from 'models/WebSocket';
import React from 'react';
import ConfigurationPushesNotificationContent from './ConfigurationPushes';

interface Props {
  notification?: WebSocketNotification;
}

const NotificationContent: React.FC<Props> = ({ notification }) => {
  if (!notification) return null;

  if (notification.type === 'entity_configuration_update' || notification.type === 'venue_configuration_update') {
    return <ConfigurationPushesNotificationContent notification={notification} />;
  }
  return null;
};

export default NotificationContent;
