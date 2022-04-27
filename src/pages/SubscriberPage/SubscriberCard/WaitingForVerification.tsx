import React from 'react';
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
import { useSendSubscriberEmailValidation } from 'hooks/Network/Subscribers';
import WarningButton from 'components/Buttons/WarningButton';

interface Props {
  id: string;
  isWaitingForEmailVerification?: boolean;
  isDisabled?: boolean;
  refresh: () => void;
}

const defaultProps = {
  isWaitingForEmailVerification: false,
  isDisabled: false,
};

const WaitingForVerificationNotification: React.FC<Props> = ({
  id,
  isWaitingForEmailVerification,
  isDisabled,
  refresh,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onSuccess = () => {
    refresh();
    onClose();
  };
  const { mutateAsync: sendValidation, isLoading } = useSendSubscriberEmailValidation({ id, refresh: onSuccess });

  const handleValidationClick = () => sendValidation();

  if (!isWaitingForEmailVerification) return null;

  return (
    <>
      <WarningButton
        label={t('users.waitiing_for_email_verification')}
        ml={2}
        isDisabled={isDisabled}
        onClick={onOpen}
      />
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered leastDestructiveRef={undefined}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{t('users.send_validation')}</AlertDialogHeader>
            <AlertDialogBody>{t('users.send_validation_explanation')}</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose} mr={4}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleValidationClick} isLoading={isLoading} colorScheme="red">
                {t('common.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

WaitingForVerificationNotification.defaultProps = defaultProps;
export default React.memo(WaitingForVerificationNotification);
