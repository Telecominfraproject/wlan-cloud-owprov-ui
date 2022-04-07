import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import SaveButton from 'components/Buttons/SaveButton';
import { useAuth } from 'contexts/AuthProvider';
import { useGetRoot } from 'hooks/Network/Entity';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'components/ModalHeader';
import CreateRootForm from './Form';

const CreateRootModal = () => {
  const { t } = useTranslation();
  const { isUserLoaded } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const getRoot = useGetRoot({ openModal: onOpen });
  const [form, setForm] = useState({});
  const formRef = useCallback(
    (node) => {
      if (
        node !== null &&
        (form.submitForm !== node.submitForm ||
          form.isSubmitting !== node.isSubmitting ||
          form.isValid !== node.isValid ||
          form.dirty !== node.dirty)
      ) {
        setForm(node);
      }
    },
    [form],
  );

  useEffect(() => {
    if (isUserLoaded) getRoot.refetch();
  }, [isUserLoaded]);

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} size="xl">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
        <ModalHeader
          title={t('entities.create_root')}
          right={
            <SaveButton
              onClick={form.submitForm}
              isLoading={form.isSubmitting}
              isDisabled={!form.isValid || !form.dirty}
            />
          }
        />
        <ModalBody>
          <CreateRootForm isOpen={isOpen} onClose={onClose} formRef={formRef} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateRootModal;
