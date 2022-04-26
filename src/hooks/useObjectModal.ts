import { useCallback, useMemo, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';

const useObjectModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [obj, setObj] = useState(null);

  const openModal = useCallback((newObj) => {
    setObj(newObj);
    onOpen();
  }, []);

  const toReturn = useMemo(
    () => ({
      isOpen,
      openModal,
      obj,
      onClose,
    }),
    [isOpen, obj],
  );

  return toReturn;
};

export default useObjectModal;
