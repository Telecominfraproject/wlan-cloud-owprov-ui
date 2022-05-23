import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseButton, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import ModalHeader from 'components/Modals/ModalHeader';
import ValidatePhoneNumberIntro from './ValidatePhoneNumberIntro';
import ValidatePhoneNumberTests from './ValidatePhoneNumberTests';
import ValidatePhoneNumberSuccess from './ValidatePhoneNumberSuccess';

const AddPhoneNumberModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess: (phone: string) => void }> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'success'>('intro');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();

  const closeCancelAndForm = () => {
    onClose();
    closeConfirm();
    setPhoneNumber('');
    setCurrentStep('intro');
  };

  const onIntroEnd = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentStep('test');
  };
  const onTestEnd = () => setCurrentStep('success');
  const onComplete = () => {
    onSuccess(phoneNumber);
    onClose();
  };

  return (
    <Modal onClose={openConfirm} isOpen={isOpen} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader title={t('account.activating_sms_mfa')} right={<CloseButton ml={2} onClick={openConfirm} />} />
        <ModalBody>
          {currentStep === 'intro' && <ValidatePhoneNumberIntro nextStep={onIntroEnd} />}
          {currentStep === 'test' && phoneNumber.length > 0 && (
            <ValidatePhoneNumberTests phoneNumber={phoneNumber} nextStep={onTestEnd} />
          )}
          {currentStep === 'success' && <ValidatePhoneNumberSuccess nextStep={onComplete} />}
        </ModalBody>
      </ModalContent>
      <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </Modal>
  );
};

export default AddPhoneNumberModal;
