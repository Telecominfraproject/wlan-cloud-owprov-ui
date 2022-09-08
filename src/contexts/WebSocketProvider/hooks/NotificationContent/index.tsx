import { WebSocketNotification } from 'models/WebSocket';
import React from 'react';
import ConfigurationPushesNotificationContent from './ConfigurationPushes';
import DeviceRebootNotificationContent from './DeviceReboot';
import DeviceUpgradeNotificationContent from './DeviceUpgrade';

interface Props {
  notification?: WebSocketNotification;
}

const NotificationContent: React.FC<Props> = ({ notification }) => {
  if (!notification) return null;

  if (notification.type === 'entity_configuration_update' || notification.type === 'venue_configuration_update') {
    return <ConfigurationPushesNotificationContent notification={notification} />;
  }

  if (notification.type === 'venue_rebooter') {
    return <DeviceRebootNotificationContent notification={notification} />;
  }

  if (notification.type === 'venue_upgrader') {
    return <DeviceUpgradeNotificationContent notification={notification} />;
  }
  return null;
};

export default NotificationContent;
