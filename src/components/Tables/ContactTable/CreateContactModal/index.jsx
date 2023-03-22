import React from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CreateContactForm from './Form';
import CloseButton from 'components/Buttons/CloseButton';
import CreateButton from 'components/Buttons/CreateButton';
import SaveButton from 'components/Buttons/SaveButton';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import ModalHeader from 'components/Modals/ModalHeader';
import { useAuth } from 'contexts/AuthProvider';
import useFormRef from 'hooks/useFormRef';

const propTypes = {
  refresh: PropTypes.func.isRequired,
  entityId: PropTypes.string,
  isVenue: PropTypes.bool,
  onCreate: PropTypes.func,
};

const defaultProps = {
  isVenue: false,
  entityId: null,
  onCreate: () => {},
};

const CreateContactModal = ({ refresh, entityId, isVenue, onCreate }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { form, formRef } = useFormRef();

  const closeModal = () => (form.dirty ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const parent = () => {
    if (!entityId) return '';
    if (isVenue) return `ven:${entityId}`;
    return `ent:${entityId}`;
  };

  return (
    <>
      {user?.userRole === 'CSR' ? null : <CreateButton onClick={onOpen} ml={2} />}
      <Modal onClose={closeModal} isOpen={isOpen} size="xl" initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={t('crud.create_object', { obj: t('contacts.one') })}
            right={
              <>
                <SaveButton
                  onClick={form.submitForm}
                  isLoading={form.isSubmitting}
                  isDisabled={!form.isValid || !form.dirty}
                />
                <CloseButton ml={2} onClick={closeModal} ref={initialRef} />
              </>
            }
          />
          <ModalBody>
            <CreateContactForm
              isOpen={isOpen}
              onClose={onClose}
              refresh={refresh}
              formRef={formRef}
              parent={parent()}
              onCreate={onCreate}
            />
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

CreateContactModal.propTypes = propTypes;
CreateContactModal.defaultProps = defaultProps;

export default CreateContactModal;
