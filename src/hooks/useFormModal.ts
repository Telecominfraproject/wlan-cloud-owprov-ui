import { useMemo } from 'react';
import { useDisclosure } from '@chakra-ui/react';

type UseFormModalProps = {
  isDirty?: boolean;
  onModalClose?: () => void;
  onCloseSideEffect?: () => void;
};

const useFormModal = ({ isDirty, onModalClose, onCloseSideEffect }: UseFormModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();

  const closeModal = () => {
    if (isDirty) openConfirm();
    else if (onModalClose) onModalClose();
    else {
      onClose();
      if (onCloseSideEffect) onCloseSideEffect();
    }
  };

  const closeCancelAndForm = () => {
    closeConfirm();
    if (onModalClose) onModalClose();
    else {
      onClose();
      if (onCloseSideEffect) onCloseSideEffect();
    }
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
