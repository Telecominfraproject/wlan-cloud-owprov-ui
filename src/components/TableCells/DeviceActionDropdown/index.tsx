import React from 'react';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, Spinner, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import useMutationResult from 'hooks/useMutationResult';
import { Device } from 'models/Device';
import { Wrench } from 'phosphor-react';
import { useBlinkDevice, useGetDeviceRtty, useRebootDevice } from 'hooks/Network/GatewayDevices';

interface Props {
  device: Device;
  refresh: () => void;
  isDisabled?: boolean;
  onOpenScan: (serialNumber: string) => void;
  onOpenFactoryReset: (serialNumber: string) => void;
  onOpenUpgradeModal: (serialNumber: string) => void;
}

const DeviceActionDropdown: React.FC<Props> = ({
  device,
  refresh,
  isDisabled,
  onOpenScan,
  onOpenFactoryReset,
  onOpenUpgradeModal,
}) => {
  const { t } = useTranslation();
  const { refetch: getRtty, isLoading: isRtty } = useGetDeviceRtty({
    serialNumber: device.serialNumber,
    extraId: 'inventory-modal',
  });
  const { mutateAsync: reboot, isLoading: isRebooting } = useRebootDevice({ serialNumber: device.serialNumber });
  const { mutateAsync: blink } = useBlinkDevice({ serialNumber: device.serialNumber });
  const { onSuccess: onRebootSuccess, onError: onRebootError } = useMutationResult({
    objName: t('devices.one'),
    operationType: 'reboot',
    refresh,
  });
  const { onSuccess: onBlinkSuccess, onError: onBlinkError } = useMutationResult({
    objName: t('devices.one'),
    operationType: 'blink',
    refresh,
  });

  const handleRebootClick = () =>
    reboot(undefined, {
      onSuccess: () => {
        onRebootSuccess();
      },
      onError: (e) => {
        onRebootError(e);
      },
    });
  const handleBlinkClick = () =>
    blink(undefined, {
      onSuccess: () => {
        onBlinkSuccess();
      },
      onError: (e) => {
        onBlinkError(e);
      },
    });
  const handleOpenScan = () => onOpenScan(device.serialNumber);
  const handleOpenFactoryReset = () => onOpenFactoryReset(device.serialNumber);
  const handleOpenUpgrade = () => onOpenUpgradeModal(device.serialNumber);
  const handleConnectClick = () => getRtty();

  return (
    <Menu>
      <Tooltip label={t('commands.other')}>
        <MenuButton
          as={IconButton}
          aria-label="Commands"
          icon={isRebooting || isRtty ? <Spinner /> : <Wrench size={20} />}
          size="sm"
          isDisabled={isDisabled}
          ml={2}
        />
      </Tooltip>
      <MenuList>
        <MenuItem onClick={handleRebootClick}>{t('commands.reboot')}</MenuItem>
        <MenuItem onClick={handleBlinkClick}>{t('commands.blink')}</MenuItem>
        <MenuItem onClick={handleConnectClick}>{t('commands.connect')}</MenuItem>
        <MenuItem onClick={handleOpenScan}>{t('commands.wifiscan')}</MenuItem>
        <MenuItem onClick={handleOpenUpgrade}>{t('commands.firmware_upgrade')}</MenuItem>
        <MenuItem onClick={handleOpenFactoryReset}>{t('commands.factory_reset')}</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default React.memo(DeviceActionDropdown);
