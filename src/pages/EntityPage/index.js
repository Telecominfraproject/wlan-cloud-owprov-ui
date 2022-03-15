import React from 'react';
import { useAuth } from 'contexts/AuthProvider';
import { Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import EntityCard from './EntityCard';
import EntityChildrenCard from './EntityChildrenCard';

const EntityPage = () => {
  const { isUserLoaded } = useAuth();
  const { id } = useParams();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && id !== '' && (
        <>
          <EntityCard id={id} />
          <EntityChildrenCard id={id} />
        </>
      )}
    </Flex>
  );
};

export default EntityPage;
