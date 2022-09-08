import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flex,
  IconButton,
  Tooltip,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Center,
  Box,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { MagnifyingGlass, Trash } from 'phosphor-react';
import useMutationResult from 'hooks/useMutationResult';
import { useDeleteSubscriberDevice } from 'hooks/Network/SubscriberDevices';
import { DeviceCell } from 'models/Table';
import { Device } from 'models/Device';
import DeviceActionDropdown from 'components/TableCells/DeviceActionDropdown';

interface Props {
  cell: DeviceCell;
  refreshTable: () => void;
  openEdit: (sub: Device) => void;
  onOpenScan: (serialNumber: string) => void;
  onOpenFactoryReset: (serialNumber: string) => void;
  onOpenUpgradeModal: (serialNumber: string) => void;
}

const Actions: React.FC<Props> = ({
  cell: {
    original: { id, name },
  },
  cell: { original: subscriberDevice },
  refreshTable,
  openEdit,
  onOpenScan,
  onOpenFactoryReset,
  onOpenUpgradeModal,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onSuccess, onError } = useMutationResult({
    objName: t('devices.one'),
    operationType: 'delete',
    refresh: refreshTable,
  });
  const deleteDevice = useDeleteSubscriberDevice({ id });

  const handleEditClick = () => {
    openEdit(subscriberDevice);
  };

  const handleDeleteClick = () =>
    deleteDevice.mutateAsync(undefined, {
      onSuccess: () => onSuccess(),
      onError: (e) => onError(e),
    });

  return (
    <Flex>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton aria-label="delete-device" colorScheme="red" icon={<Trash size={20} />} size="sm" />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {name}
          </PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('devices.one') })}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={deleteDevice.isLoading}>
                {t('common.yes')}
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <DeviceActionDropdown
        device={subscriberDevice}
        refresh={refreshTable}
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          aria-label="view-device-details"
          ml={2}
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          size="sm"
          onClick={handleEditClick}
        />
      </Tooltip>
    </Flex>
  );
};

export default Actions;
