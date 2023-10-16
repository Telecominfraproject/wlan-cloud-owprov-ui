import * as React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import DetailsModal from '.';
import { GlobalReachAccount } from 'hooks/Network/GlobalReach';

const useGlobalAccountModal = () => {
  const [account, setAccount] = React.useState<GlobalReachAccount | null>(null);
  const modalProps = useDisclosure();

  const openModal = (newAcc: GlobalReachAccount) => {
    setAccount(newAcc);
    modalProps.onOpen();
  };

  return React.useMemo(
    () => ({
      openModal,
      modal: account ? <DetailsModal account={account} modalProps={modalProps} /> : null,
    }),
    [account, modalProps],
  );
};

export default useGlobalAccountModal;
