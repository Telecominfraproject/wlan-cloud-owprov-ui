import React from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CreateEntityForm from './Form';
import CloseButton from 'components/Buttons/CloseButton';
import SaveButton from 'components/Buttons/SaveButton';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import ModalHeader from 'components/Modals/ModalHeader';
import useFormRef from 'hooks/useFormRef';

const propTypes = {
  parentId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

const defaultProps = {
  isOpen: false,
};

const CreateEntityModal = ({ parentId, onClose, isOpen }) => {
  const { t } = useTranslation();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { form, formRef } = useFormRef();

  const closeModal = () => (form.dirty ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('crud.create_object', { obj: t('entities.sub_one') })}
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
          <CreateEntityForm isOpen={isOpen} onClose={onClose} formRef={formRef} parentId={parentId} />
        </ModalBody>
      </ModalContent>
      <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </Modal>
  );
};

CreateEntityModal.propTypes = propTypes;
CreateEntityModal.defaultProps = defaultProps;

export default CreateEntityModal;
