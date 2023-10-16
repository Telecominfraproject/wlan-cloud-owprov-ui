import * as React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import DetailsModal from '.';
import { GoogleOrionAccount } from 'hooks/Network/GoogleOrion';

const useGoogleOrionAccountModal = () => {
  const [account, setAccount] = React.useState<GoogleOrionAccount>();
  const modalProps = useDisclosure();

  const openModal = (newAcc: GoogleOrionAccount) => {
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

export default useGoogleOrionAccountModal;
