import React from 'react';
import { Flex } from '@chakra-ui/react';
import MapCard from './MapCard';
import { useAuth } from 'contexts/AuthProvider';

const MapPage = () => {
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && <MapCard />}
    </Flex>
  );
};

export default MapPage;
