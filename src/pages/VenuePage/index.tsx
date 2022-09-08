import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useAuth } from 'contexts/AuthProvider';
import VenueCard from './VenueCard';
import VenueChildrenCard from './VenueChildrenCard';

const VenuePage = ({ idToUse }: { idToUse?: string }) => {
  const { isUserLoaded } = useAuth();
  const { id } = useParams();

  const entityIdToUse = React.useMemo(() => {
    if (id !== undefined && id !== '') {
      return id;
    }
    if (idToUse !== undefined && idToUse !== '') {
      return idToUse;
    }

    return undefined;
  }, [idToUse, id]);

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && entityIdToUse !== undefined && (
        <>
          <VenueCard id={entityIdToUse} />
          <VenueChildrenCard id={entityIdToUse} />
        </>
      )}
    </Flex>
  );
};

export default VenuePage;
