import React from 'react';
import { useBreakpoint, Button, IconButton, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRebootVenueDevices } from 'hooks/Network/Venues';
import { Power } from 'phosphor-react';

const RebootAllDevicesButton = ({ venueId }: { venueId: string }) => {
  const { t } = useTranslation();
  const { mutateAsync: rebootDevices, isLoading } = useRebootVenueDevices({ id: venueId });
  const breakpoint = useBreakpoint();

  const handleClick = () => {
    rebootDevices();
  };

  if (breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="blue"
        type="button"
        onClick={handleClick}
        rightIcon={<Power size={20} />}
        isLoading={isLoading}
        ml={2}
      >
        {t('venues.reboot_all_devices')}
      </Button>
    );
  }
  return (
    <Tooltip label={t('venues.reboot_all_devices')}>
      <IconButton
        aria-label="Reboot all Venue Devices"
        colorScheme="blue"
        type="button"
        onClick={handleClick}
        icon={<Power size={20} />}
        ml={2}
        isLoading={isLoading}
      />
    </Tooltip>
  );
};

export default RebootAllDevicesButton;
