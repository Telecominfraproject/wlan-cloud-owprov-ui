import React from 'react';
import PropTypes from 'prop-types';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import CreateButton from 'components/Buttons/CreateButton';
import useFormRef from 'hooks/useFormRef';
import CreateVenueForm from './Form';

const propTypes = {
  isDisabled: PropTypes.bool,
  parentId: PropTypes.string,
  entityId: PropTypes.string,
};

const defaultProps = {
  isDisabled: false,
  parentId: '',
  entityId: '',
};

const CreateVenueModal = ({ parentId, entityId, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { form, formRef } = useFormRef();

  const closeModal = () => (form.dirty ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  return (
    <>
      <CreateButton onClick={onOpen} isDisabled={isDisabled} />
      <Modal onClose={closeModal} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={t('venues.create_child')}
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
            <CreateVenueForm
              isOpen={isOpen}
              onClose={onClose}
              formRef={formRef}
              parentId={parentId}
              entityId={entityId}
            />
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

CreateVenueModal.propTypes = propTypes;
CreateVenueModal.defaultProps = defaultProps;

export default CreateVenueModal;
