import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useBoolean,
  Center,
  Spinner,
  FormControl,
  FormLabel,
  Switch,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import FirmwareList from './FirmwareList';
import CloseButton from 'components/Buttons/CloseButton';
import ConfirmFirmwareUpgrade from 'components/Modals/Actions/ConfirmFirmwareUpgrade';
import ConfirmIgnoreCommand from 'components/Modals/Actions/ConfirmIgnoreCommand';
import ModalHeader from 'components/Modals/ModalHeader';
import { useGetAvailableFirmware, useUpdateDeviceFirmware } from 'hooks/Network/Firmware';
import { useGetDevice } from 'hooks/Network/GatewayDevices';
import useCommandModal from 'hooks/useCommandModal';
import { ModalProps } from 'models/Modal';

interface Props {
  modalProps: ModalProps;
  serialNumber: string;
}

const FirmwareUpgradeModal = ({ modalProps: { isOpen, onClose }, serialNumber }: Props) => {
  const { t } = useTranslation();
  const [showDevFirmware, { toggle: toggleDev }] = useBoolean();
  const [isRedirector, { toggle }] = useBoolean(false);
  const { data: device, isFetching: isFetchingDevice } = useGetDevice({ serialNumber, onClose });
  const { data: firmware, isFetching: isFetchingFirmware } = useGetAvailableFirmware({
    deviceType: device?.compatible ?? '',
  });
  const { mutateAsync: upgrade, isLoading: isUpgrading } = useUpdateDeviceFirmware({
    serialNumber,
    onClose,
  });
  const { isConfirmOpen, closeConfirm, closeModal, closeCancelAndForm } = useCommandModal({
    isLoading: isUpgrading,
    onModalClose: onClose,
  });

  const [pendingUri, setPendingUri] = React.useState<string>();

  const submit = (uri: string) => setPendingUri(uri);

  const cancelUpgrade = () => setPendingUri(undefined);

  const confirmUpgrade = () => {
    if (pendingUri) {
      upgrade({ keepRedirector: isRedirector, uri: pendingUri });
    }
    setPendingUri(undefined);
  };

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
        <ModalHeader
          title={`${t('commands.firmware_upgrade')} #${serialNumber}`}
          right={
            <>
              <Text>{t('controller.firmware.show_dev_releases')}</Text>
              <Switch mx={2} isChecked={showDevFirmware} onChange={toggleDev} size="lg" />
              <CloseButton onClick={closeModal} />
            </>
          }
        />
        <ModalBody>
          {isUpgrading || isFetchingDevice || isFetchingFirmware ? (
            <Center>
              <Spinner size="lg" />
            </Center>
          ) : (
            <>
              <Heading size="sm" mb={4}>
                {t('devices.current_firmware')}: {device?.firmware}
              </Heading>
              <FormControl>
                <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                  {t('commands.keep_redirector')}
                </FormLabel>
                <Switch isChecked={isRedirector} onChange={toggle} borderRadius="15px" size="lg" />
              </FormControl>
              {firmware?.firmwares && (
                <FirmwareList
                  firmware={firmware.firmwares.filter((firmw) => showDevFirmware || !firmw.revision.includes('devel'))}
                  upgrade={submit}
                  isLoading={isUpgrading}
                />
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
      <ConfirmFirmwareUpgrade
        isOpen={pendingUri !== undefined}
        explanation={t('commands.confirm_firmware_upgrade_explanation', { serialNumber, uri: pendingUri })}
        confirm={confirmUpgrade}
        cancel={cancelUpgrade}
      />
      <ConfirmIgnoreCommand
        modalProps={{ isOpen: isConfirmOpen, onOpen: () => {}, onClose: closeConfirm }}
        confirm={closeCancelAndForm}
        cancel={closeConfirm}
      />
    </Modal>
  );
};

export default FirmwareUpgradeModal;
