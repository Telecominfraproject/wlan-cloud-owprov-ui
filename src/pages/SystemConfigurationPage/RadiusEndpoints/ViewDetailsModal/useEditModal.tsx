import * as React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import DetailsModal from '.';
import { RadiusEndpoint } from 'hooks/Network/RadiusEndpoints';

type Props = {
  hideEdit?: boolean;
};

const useRadiusEndpointAccountModal = ({ hideEdit }: Props) => {
  const [endpoint, setEndpoint] = React.useState<RadiusEndpoint>();
  const modalProps = useDisclosure();

  const openModal = (newEndpoint: RadiusEndpoint) => {
    setEndpoint(newEndpoint);
    modalProps.onOpen();
  };

  return React.useMemo(
    () => ({
      openModal,
      modal: endpoint ? <DetailsModal endpoint={endpoint} modalProps={modalProps} hideEdit={hideEdit} /> : null,
    }),
    [endpoint, modalProps],
  );
};

export default useRadiusEndpointAccountModal;
