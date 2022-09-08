import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalProps } from 'models/Modal';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useBoolean,
  Center,
  Spinner,
  Alert,
  FormControl,
  FormLabel,
  Switch,
  Button,
} from '@chakra-ui/react';
import ModalHeader from 'components/Modals/ModalHeader';
import CloseButton from 'components/Buttons/CloseButton';
import ConfirmIgnoreCommand from 'components/Modals/Actions/ConfirmIgnoreCommand';
import useCommandModal from 'hooks/useCommandModal';
import { useFactoryReset } from 'hooks/Network/GatewayDevices';

interface Props {
  modalProps: ModalProps;
  serialNumber: string;
}

const FactoryResetModal: React.FC<Props> = ({ modalProps: { isOpen, onClose }, serialNumber }) => {
  const { t } = useTranslation();
  const [isRedirector, { toggle }] = useBoolean(false);
  const { mutateAsync: factoryReset, isLoading } = useFactoryReset({
    serialNumber,
    keepRedirector: isRedirector,
    onClose,
  });
  const { isConfirmOpen, closeConfirm, closeModal, closeCancelAndForm } = useCommandModal({
    isLoading,
    onModalClose: onClose,
  });

  const submit = () => {
    factoryReset();
  };

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader title={t('commands.factory_reset')} right={<CloseButton ml={2} onClick={closeModal} />} />
        <ModalBody>
          {isLoading ? (
            <Center>
              <Spinner size="lg" />
            </Center>
          ) : (
            <>
              <Alert colorScheme="red" mb={6}>
                {t('commands.factory_reset_warning')}
              </Alert>
              <FormControl>
                <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                  {t('commands.keep_redirector')}
                </FormLabel>
                <Switch isChecked={isRedirector} onChange={toggle} borderRadius="15px" size="lg" />
              </FormControl>
              <Center mb={6}>
                <Button size="lg" colorScheme="red" onClick={submit} fontWeight="bold">
                  {t('commands.confirm_reset', { serialNumber })}
                </Button>
              </Center>
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

export default FactoryResetModal;
