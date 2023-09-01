import React from 'react';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, Tooltip, useDisclosure } from '@chakra-ui/react';
import { Wrench } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import VenueFirmwareUpgradeModal from './VenueFirmwareUpgradeModal';
import { useRebootVenueDevices, useUpdateVenueDevices } from 'hooks/Network/Venues';

type Props = {
  venueId: string;
  isDisabled: boolean;
};

const VenueActions = ({ venueId, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { isOpen: isUpgradeOpen, onOpen: onOpenUpgrade, onClose: onCloseUpgrade } = useDisclosure();
  const { mutateAsync: rebootDevices } = useRebootVenueDevices({ id: venueId });
  const updateDevices = useUpdateVenueDevices({ id: venueId });

  const handleUpdateClick = () => {
    updateDevices.mutateAsync();
  };

  const handleRebootClick = () => {
    rebootDevices();
  };

  return (
    <>
      <Menu>
        <Tooltip label={t('common.actions')} hasArrow>
          <MenuButton as={IconButton} icon={<Wrench size={20} />} isDisabled={isDisabled}>
            {t('common.actions')}
          </MenuButton>
        </Tooltip>
        <MenuList>
          <MenuItem onClick={handleRebootClick}>{t('venues.reboot_all_devices')}</MenuItem>
          <MenuItem onClick={handleUpdateClick}>{t('venues.update_all_devices')}</MenuItem>
          <MenuItem onClick={onOpenUpgrade}>{t('venues.upgrade_all_devices')}</MenuItem>
        </MenuList>
      </Menu>
      <VenueFirmwareUpgradeModal isOpen={isUpgradeOpen} onClose={onCloseUpgrade} venueId={venueId} />
    </>
  );
};

export default React.memo(VenueActions);
