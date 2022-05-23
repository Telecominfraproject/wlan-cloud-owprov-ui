import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
  CloseButton as ChakraCloseButton,
  VStack,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { WebSocketNotification } from 'models/WebSocket';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import { useTranslation } from 'react-i18next';
import { getNotificationDescription, getStatusFromNotification } from '../../utils';
import NotificationContent from '.';

const useWebSocketNotification = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notif, setNotif] = useState<WebSocketNotification | undefined>(undefined);
  const toast = useToast();

  const openDetails = useCallback((newObj: WebSocketNotification, closeToast?: () => void) => {
    setNotif(newObj);
    if (closeToast) closeToast();
    onOpen();
  }, []);

  const pushNotification = useCallback((notification: WebSocketNotification) => {
    toast({
      id: uuid(),
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      render: ({ onClose: closeToast }) => (
        <Alert variant="solid" status={getStatusFromNotification(notification)}>
          <AlertIcon />
          <VStack spacing={1} align="stretch">
            <AlertTitle>{notification.content.title}</AlertTitle>
            <AlertDescription>{getNotificationDescription(t, notification)}</AlertDescription>
            <Button size="sm" colorScheme="blue" onClick={() => openDetails(notification, closeToast)}>
              {t('common.view_details')}
            </Button>
          </VStack>
          <ChakraCloseButton alignSelf="flex-start" position="relative" right={-1} top={-1} onClick={closeToast} />
        </Alert>
      ),
    });
  }, []);

  const modal = useMemo(
    () => (
      <Modal onClose={onClose} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
          <ModalHeader title={notif?.content?.title ?? ''} right={<CloseButton ml={2} onClick={onClose} />} />
          <ModalBody>
            <NotificationContent notification={notif} />
          </ModalBody>
        </ModalContent>
      </Modal>
    ),
    [notif, isOpen],
  );

  const toReturn = useMemo(
    () => ({
      modal,
      pushNotification,
    }),
    [modal],
  );

  return toReturn;
};

export default useWebSocketNotification;
