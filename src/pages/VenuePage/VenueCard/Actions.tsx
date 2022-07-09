import React from 'react';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useRebootVenueDevices, useUpdateVenueDevices, useUpgradeVenueDevices } from 'hooks/Network/Venues';

interface Props {
  venueId: string;
  isDisabled: boolean;
}

const VenueActions: React.FC<Props> = ({ venueId, isDisabled }) => {
  const { t } = useTranslation();
  const { mutateAsync: rebootDevices } = useRebootVenueDevices({ id: venueId });
  const updateDevices = useUpdateVenueDevices({ id: venueId });
  const upgradeDevices = useUpgradeVenueDevices({ id: venueId });

  const handleUpdateClick = () => {
    updateDevices.mutateAsync();
  };

  const handleRebootClick = () => {
    rebootDevices();
  };

  const handleUpgradeDevices = () => {
    upgradeDevices.mutateAsync();
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} ml={2} isDisabled={isDisabled}>
        {t('common.actions')}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleRebootClick}>{t('venues.reboot_all_devices')}</MenuItem>
        <MenuItem onClick={handleUpdateClick}>{t('venues.update_all_devices')}</MenuItem>
        <MenuItem onClick={handleUpgradeDevices}>{t('venues.upgrade_all_devices')}</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default React.memo(VenueActions);
