import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CreateSubscriberForm from './Form';
import CloseButton from 'components/Buttons/CloseButton';
import CreateButton from 'components/Buttons/CreateButton';
import SaveButton from 'components/Buttons/SaveButton';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import ModalHeader from 'components/Modals/ModalHeader';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';

const propTypes = {
  refresh: PropTypes.func.isRequired,
  operatorId: PropTypes.string.isRequired,
};
const CreateSubscriberModal = ({ refresh, operatorId }) => {
  const { t } = useTranslation();
  const { form, formRef } = useFormRef();
  const { isOpen, isConfirmOpen, onOpen, closeConfirm, closeModal, closeCancelAndForm } = useFormModal({
    isDirty: form?.dirty,
  });

  return (
    <>
      <CreateButton onClick={onOpen} ml={2} />
      <Modal onClose={closeModal} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={t('crud.create_object', { obj: t('subscribers.one') })}
            right={
              <>
                <SaveButton
                  onClick={form.submitForm}
                  isLoading={form.isSubmitting}
                  isDisabled={!form.isValid || !form.dirty}
                />
                <CloseButton ml={2} onClick={closeModal} />
              </>
            }
          />
          <ModalBody>
            <CreateSubscriberForm
              isOpen={isOpen}
              onClose={closeCancelAndForm}
              refresh={refresh}
              formRef={formRef}
              operatorId={operatorId}
            />
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={isConfirmOpen} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

CreateSubscriberModal.propTypes = propTypes;

export default CreateSubscriberModal;
