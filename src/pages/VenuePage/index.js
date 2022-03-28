import React from 'react';
import { useAuth } from 'contexts/AuthProvider';
import { Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import VenueCard from './VenueCard';
import VenueChildrenCard from './VenueChildrenCard';

const VenuePage = () => {
  const { isUserLoaded } = useAuth();
  const { id } = useParams();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && id !== '' && (
        <>
          <VenueCard id={id} />
          <VenueChildrenCard id={id} />
        </>
      )}
    </Flex>
  );
};

export default VenuePage;
