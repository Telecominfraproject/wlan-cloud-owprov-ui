import { useMemo } from 'react';
import { useDisclosure } from '@chakra-ui/react';

interface Props {
  isDirty?: boolean;
  onModalClose?: () => void;
}
const useFormModal = ({ isDirty, onModalClose }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();

  const closeModal = () => {
    if (isDirty) openConfirm();
    else if (onModalClose) onModalClose();
    else onClose();
  };

  const closeCancelAndForm = () => {
    closeConfirm();
    if (onModalClose) onModalClose();
    else onClose();
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
