import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import CreateButton from 'components/Buttons/CreateButton';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import CreateOperatorForm from './Form';

const propTypes = {
  refresh: PropTypes.func.isRequired,
};

const CreateOperatorModal = ({ refresh }) => {
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
            title={t('crud.create_object', { obj: t('operator.operator', { count: 1 }) })}
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
            <CreateOperatorForm isOpen={isOpen} onClose={closeCancelAndForm} refresh={refresh} formRef={formRef} />
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={isConfirmOpen} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

CreateOperatorModal.propTypes = propTypes;

export default CreateOperatorModal;
