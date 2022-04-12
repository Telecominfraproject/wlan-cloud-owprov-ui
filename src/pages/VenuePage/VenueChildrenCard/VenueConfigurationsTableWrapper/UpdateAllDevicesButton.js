import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { useBreakpoint, useToast, Button, IconButton, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useUpdateVenueDevices } from 'hooks/Network/Venues';
import { ClockClockwise } from 'phosphor-react';

const propTypes = {
  venueId: PropTypes.string.isRequired,
};

const UpdateAllDevicesButton = ({ venueId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const updateDevices = useUpdateVenueDevices({ id: venueId });
  const breakpoint = useBreakpoint();

  const handleClick = () => {
    updateDevices.mutateAsync(
      {},
      {
        onSuccess: ({ data }) => {
          toast({
            id: 'venue-update-devices-success',
            title: t('common.success'),
            description: t('venues.successfully_update_devices', { num: data.serialNumbers.length }),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
        onError: (e) => {
          toast({
            id: uuid(),
            title: t('common.error'),
            description: t('crud.error_create_obj', {
              obj: t('venues.error_update_devices'),
              e: e?.response?.data?.ErrorDescription,
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
      },
    );
  };

  if (breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="blue"
        type="button"
        onClick={handleClick}
        rightIcon={<ClockClockwise size={20} />}
        isLoading={updateDevices.isLoading}
        ml={2}
      >
        {t('venues.update_all_devices')}
      </Button>
    );
  }
  return (
    <Tooltip label={t('venues.update_all_devices')}>
      <IconButton
        colorScheme="blue"
        type="button"
        onClick={handleClick}
        icon={<ClockClockwise size={20} />}
        ml={2}
        isLoading={updateDevices.isLoading}
      />
    </Tooltip>
  );
};

UpdateAllDevicesButton.propTypes = propTypes;
export default UpdateAllDevicesButton;
