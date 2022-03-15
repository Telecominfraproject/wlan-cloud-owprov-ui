import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  CloseButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import SaveButton from 'components/Buttons/SaveButton';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import ModalHeader from 'components/ModalHeader';
import GoogleAuthenticatorIntro from './GoogleAuthenticatorIntro';
import GoogleAuthenticatorQrDisplay from './GoogleAuthenticatorQrDisplay';
import GoogleAuthenticatorTests from './GoogleAuthenticatorTests';
import GoogleAuthenticatorActivationSuccess from './GoogleAuthenticatorActivationSuccess';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

const GoogleAuthenticatorModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState('intro');
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();

  const closeCancelAndForm = () => {
    onClose();
    closeConfirm();
    setCurrentStep('intro');
  };

  const onActivated = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal onClose={openConfirm} isOpen={isOpen} size="xl">
      <ModalOverlay />
      <ModalContent size="xl">
        <ModalHeader
          title={t('account.activating_google_authenticator')}
          right={
            <>
              <SaveButton onClick={onActivated} isDisabled={currentStep !== 'activated'} />
              <CloseButton ml={2} onClick={openConfirm} />
            </>
          }
        />
        <ModalBody>
          {currentStep === 'intro' && <GoogleAuthenticatorIntro setCurrentStep={setCurrentStep} />}
          {currentStep === 'qr-code' && (
            <GoogleAuthenticatorQrDisplay setCurrentStep={setCurrentStep} />
          )}
          {currentStep === 'tests' && <GoogleAuthenticatorTests setCurrentStep={setCurrentStep} />}
          {currentStep === 'activated' && (
            <GoogleAuthenticatorActivationSuccess onSuccess={onActivated} />
          )}
        </ModalBody>
      </ModalContent>
      <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </Modal>
  );
};

GoogleAuthenticatorModal.propTypes = propTypes;

export default GoogleAuthenticatorModal;
