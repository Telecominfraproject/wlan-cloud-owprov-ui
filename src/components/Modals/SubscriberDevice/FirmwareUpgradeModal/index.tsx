import React from 'react';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { ModalProps } from 'models/Modal';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useToast,
  useBoolean,
  Center,
  Spinner,
  FormControl,
  FormLabel,
  Switch,
  Heading,
} from '@chakra-ui/react';
import ModalHeader from 'components/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';
import ConfirmIgnoreCommand from 'components/Modals/Actions/ConfirmIgnoreCommand';
import useCommandModal from 'hooks/useCommandModal';
import { useGetDevice } from 'hooks/Network/GatewayDevices';
import { useGetAvailableFirmware, useUpdateDeviceFirmware } from 'hooks/Network/Firmware';

interface Props {
  modalProps: ModalProps;
  serialNumber: string;
}

const FirmwareUpgradeModal: React.FC<Props> = ({ modalProps: { isOpen, onClose }, serialNumber }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [isRedirector, { toggle }] = useBoolean(false);
  const { data: device, isFetching: isFetchingDevice } = useGetDevice({ serialNumber });
  const { data: firmware, isFetching: isFetchingFirmware } = useGetAvailableFirmware({
    deviceType: device?.compatible ?? '',
  });
  const { mutateAsync: upgrade, isLoading: isUpgrading } = useUpdateDeviceFirmware({
    serialNumber,
  });
  const { isConfirmOpen, closeConfirm, closeModal, closeCancelAndForm } = useCommandModal({
    isLoading: isUpgrading,
    onModalClose: onClose,
  });

  const submit = (uri: string) => {
    upgrade(
      { keepRedirector: isRedirector, uri },
      {
        onSuccess: () => {
          toast({
            id: `device-upgrade-success-${uuid()}`,
            title: t('common.success'),
            description: t('commands.upgrade_success'),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          onClose();
        },
        onError: (e: any) => {
          toast({
            id: uuid(),
            title: t('common.error'),
            description: t('commands.upgrade_error', {
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

  console.log(submit);

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader title={t('commands.factory_reset')} right={<CloseButton ml={2} onClick={closeModal} />} />
        <ModalBody>
          {isUpgrading || isFetchingDevice || isFetchingFirmware ? (
            <Center>
              <Spinner size="lg" />
            </Center>
          ) : (
            <>
              <Heading size="sm">
                {t('devices.current_firmware')}: {device?.compatible}
              </Heading>
              <FormControl>
                <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                  {t('commands.keep_redirector')}
                </FormLabel>
                <Switch isChecked={isRedirector} onChange={toggle} borderRadius="15px" size="lg" />
              </FormControl>
              <pre>{JSON.stringify(firmware, null, 4)}</pre>
            </>
          )}
        </ModalBody>
      </ModalContent>
      <ConfirmIgnoreCommand
        modalProps={{ isOpen: isConfirmOpen, onOpen: () => {}, onClose: closeConfirm }}
        confirm={closeCancelAndForm}
        cancel={closeConfirm}
      />
    </Modal>
  );
};

export default FirmwareUpgradeModal;
