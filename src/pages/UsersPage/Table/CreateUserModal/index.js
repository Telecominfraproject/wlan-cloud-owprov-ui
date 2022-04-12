import React from 'react';
import PropTypes from 'prop-types';
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import { useAuth } from 'contexts/AuthProvider';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import useFormRef from 'hooks/useFormRef';
import CreateUserForm from './Form';

const propTypes = {
  requirements: PropTypes.shape({
    accessPolicy: PropTypes.string,
    passwordPolicy: PropTypes.string,
  }),
  refreshUsers: PropTypes.func.isRequired,
};

const defaultProps = {
  requirements: {
    accessPolicy: '',
    passwordPolicy: '',
  },
};

const CreateUserModal = ({ requirements, refreshUsers }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { form, formRef } = useFormRef();
  const createUser = useMutation((newUser) => axiosSec.post('user/0', newUser));

  const closeModal = () => (form.dirty ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  return (
    <>
      <Button
        hidden={user?.userRole === 'CSR'}
        alignItems="center"
        colorScheme="blue"
        rightIcon={<AddIcon />}
        onClick={onOpen}
        ml={2}
      >
        {t('crud.create')}
      </Button>
      <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={t('crud.create_object', { obj: t('user.title') })}
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
            <CreateUserForm
              requirements={requirements}
              createUser={createUser}
              isOpen={isOpen}
              onClose={onClose}
              refreshUsers={refreshUsers}
              formRef={formRef}
            />
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </Modal>
    </>
  );
};

CreateUserModal.propTypes = propTypes;
CreateUserModal.defaultProps = defaultProps;

export default CreateUserModal;
