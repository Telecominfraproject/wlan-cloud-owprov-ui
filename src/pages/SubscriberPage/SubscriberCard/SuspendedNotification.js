import React from 'react';
import PropTypes from 'prop-types';
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

const SubscriberSuspendedNotification = ({ id, isSuspended, isDisabled, refresh }) => {
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
      <AlertDialog isOpen={isOpen} isCentered>
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

SubscriberSuspendedNotification.propTypes = {
  id: PropTypes.string.isRequired,
  isSuspended: PropTypes.bool,
  isDisabled: PropTypes.bool,
  refresh: PropTypes.func.isRequired,
};
SubscriberSuspendedNotification.defaultProps = {
  isSuspended: false,
  isDisabled: false,
};

export default React.memo(SubscriberSuspendedNotification);
