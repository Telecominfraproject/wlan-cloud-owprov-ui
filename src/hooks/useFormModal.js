import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';

const useFormModal = ({ isDirty }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();

  const closeModal = () => (isDirty ? openConfirm() : onClose());
  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const toReturn = useMemo(
    () => ({
      onOpen,
      isOpen,
      isConfirmOpen,
      closeModal,
      closeConfirm,
      closeCancelAndForm,
    }),
    [isOpen, isConfirmOpen, isDirty],
  );

  return toReturn;
};

export default useFormModal;
