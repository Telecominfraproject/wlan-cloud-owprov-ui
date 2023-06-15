import React from 'react';
import {
  AlertDialogFooter,
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { ArrowSquareOut, MagnifyingGlass, PaperPlaneTilt, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'components/Modals/Modal';
import DeviceActionDropdown from 'components/TableCells/DeviceActionDropdown';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import { useDeleteTag, usePushConfig } from 'hooks/Network/Inventory';
import { Device } from 'models/Device';

interface Props {
  cell: { original: Device };
  refreshEntity: () => void;
  openEditModal: (dev: Device) => void;
  onOpenScan: (serialNumber: string) => void;
  onOpenFactoryReset: (serialNumber: string) => void;
  onOpenUpgradeModal: (serialNumber: string) => void;
}

const EntityInventoryActions = ({
  cell: { original: tag },
  refreshEntity,
  openEditModal,
  onOpenScan,
  onOpenFactoryReset,
  onOpenUpgradeModal,
}: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: gwUi } = useGetGatewayUi();
  const { mutateAsync: deleteConfig, isLoading: isDeleting } = useDeleteTag({
    name: tag.name,
    refreshTable: refreshEntity,
    onClose,
  });
  const { isOpen: isPushOpen, onOpen: openPush, onClose: closePush } = useDisclosure();
  const { isOpen: isConfirmPushOpen, onOpen: openConfirmPush, onClose: closeConfirmPush } = useDisclosure();
  const pushConfiguration = usePushConfig({
    onSuccess: () => {
      closeConfirmPush();
      openPush();
    },
  });

  const handleDeleteClick = () => deleteConfig(tag.serialNumber);
  const handleOpenEdit = () => openEditModal(tag);
  const handleOpenInGateway = () => window.open(`${gwUi}/#/devices/${tag.serialNumber}`, '_blank');
  const handleSyncConfig = () => openConfirmPush();
  const handlePushConfig = () => pushConfiguration.mutateAsync(tag.serialNumber);

  return (
    <Flex>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton aria-label="Open Delete" colorScheme="red" icon={<Trash size={20} />} size="sm" />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {tag.name}
          </PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('inventory.tag_one') })}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={isDeleting}>
                Yes
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <DeviceActionDropdown
        device={tag}
        refresh={refreshEntity}
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
      <Tooltip hasArrow label={t('configurations.push_configuration')} placement="top">
        <IconButton
          aria-label={t('configurations.push_configuration')}
          ml={2}
          colorScheme="teal"
          icon={<PaperPlaneTilt size={20} />}
          onClick={handleSyncConfig}
          size="sm"
        />
      </Tooltip>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          aria-label="Open Edit"
          ml={2}
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          size="sm"
          onClick={handleOpenEdit}
        />
      </Tooltip>
      <Tooltip hasArrow label={t('common.view_in_gateway')} placement="top">
        <IconButton
          aria-label="Go to gateway"
          ml={2}
          colorScheme="blue"
          icon={<ArrowSquareOut size={20} />}
          size="sm"
          onClick={handleOpenInGateway}
        />
      </Tooltip>
      <Modal
        title={`${t('configurations.push_configuration')}`}
        isOpen={isConfirmPushOpen}
        onClose={closeConfirmPush}
        options={{
          modalSize: 'sm',
        }}
      >
        <Box>
          <Text>
            Are you sure you want to push the configuration to device <b>#{tag.serialNumber}</b>? <br />
            <br />
            You cannot undo this action afterwards.
          </Text>
          <Center>
            <AlertDialogFooter>
              <Button onClick={closeConfirmPush}>{t('common.cancel')}</Button>
              <Button colorScheme="red" onClick={handlePushConfig} ml={2} isLoading={pushConfiguration.isLoading}>
                {t('common.yes')}
              </Button>
            </AlertDialogFooter>
          </Center>
        </Box>
      </Modal>
      <ConfigurationPushModal isOpen={isPushOpen} onClose={closePush} pushResult={pushConfiguration.data} />
    </Flex>
  );
};

export default EntityInventoryActions;
