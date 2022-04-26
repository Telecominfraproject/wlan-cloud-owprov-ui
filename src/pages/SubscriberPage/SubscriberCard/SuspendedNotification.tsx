import React from 'react';
import AlertButton from 'components/Buttons/AlertButton';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSuspendSubscriber } from 'hooks/Network/Subscribers';
import useMutationResult from 'hooks/useMutationResult';

interface Props {
  id: string;
  isSuspended?: boolean;
  isDisabled?: boolean;
  refresh: () => void;
}

const defaultProps = {
  isSuspended: false,
  isDisabled: false,
};

const SubscriberSuspendedNotification: React.FC<Props> = ({ id, isSuspended, isDisabled, refresh }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const suspend = useSuspendSubscriber({ id });
  const { onSuccess, onError } = useMutationResult({
    objName: t('subscribers.one'),
    operationType: 'update',
    refresh,
  });

  const handleSuspendClick = () => {
    suspend.mutateAsync(false, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
      onError: (e) => {
        onError(e);
      },
    });
  };
  if (!isSuspended) return null;

  return (
    <>
      <AlertButton label={t('users.suspended')} ml={2} isDisabled={isDisabled} onClick={onOpen} />
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered leastDestructiveRef={undefined}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{t('subscribers.reactivate_title')}?</AlertDialogHeader>
            <AlertDialogBody>{t('subscribers.reactivate_explanation')}</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose} mr={4}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSuspendClick} colorScheme="red">
                {t('common.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

SubscriberSuspendedNotification.defaultProps = defaultProps;
export default React.memo(SubscriberSuspendedNotification);
