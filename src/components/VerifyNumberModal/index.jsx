import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Center,
  HStack,
  PinInput,
  PinInputField,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  setValidated: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string.isRequired,
};

const VerifyNumberModal = ({ isOpen, cancel, phoneNumber, setValidated }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const sendPhoneTest = useMutation(
    (to) =>
      axiosSec.post(`sms?validateNumber=true`, {
        to,
      }),
    {
      onSuccess: () => {
        toast({
          id: 'verif-phone-success',
          title: t('common.success'),
          description: t('login.resent_code'),
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
      onError: (e) => {
        toast({
          id: 'verif-phone-error',
          title: t('common.error'),
          description: t('login.error_sending_code', { e: e?.response?.data?.ErrorDescription }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    },
  );
  const testCode = useMutation((code) =>
    axiosSec.post(`sms?completeValidation=true&validationCode=${code}`, {
      to: phoneNumber,
    }),
  );

  const cancelRef = useRef();

  const handleSendClick = () => sendPhoneTest.mutateAsync(phoneNumber);
  const onPinComplete = (code) =>
    testCode.mutateAsync(code, {
      onSuccess: () => {
        setValidated(true);
        cancel();
        toast({
          id: 'verif-phone-success',
          title: t('common.success'),
          description: t('account.success_phone_verif'),
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
      onError: () => {
        toast({
          id: 'verif-phone-error',
          title: t('common.error'),
          description: t('account.error_phone_verif'),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    });

  useEffect(() => {
    if (isOpen && phoneNumber.length > 0) sendPhoneTest.mutateAsync(phoneNumber);
  }, [phoneNumber, isOpen]);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{t('account.verify_phone_number')}</AlertDialogHeader>
          <AlertDialogBody>
            {t('account.verify_phone_instructions')}
            <Center>
              <HStack mt={4}>
                <PinInput otp onComplete={onPinComplete} autoFocus>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </Center>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={cancel} mr={4}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="blue" isLoading={sendPhoneTest.isLoading} onClick={handleSendClick}>
              {t('account.resend')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

VerifyNumberModal.propTypes = propTypes;

export default VerifyNumberModal;
