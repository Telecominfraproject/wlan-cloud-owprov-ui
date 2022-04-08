import React from 'react';
import { useAuth } from 'contexts/AuthProvider';
import { Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import DetailsCard from './DetailsCard';
import OperatorChildrenCard from './ChildrenCard';

const OperatorPage = () => {
  const { isUserLoaded } = useAuth();
  const { id } = useParams();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && id !== '' && (
        <>
          <DetailsCard id={id} />
          <OperatorChildrenCard id={id} />
        </>
      )}
    </Flex>
  );
};

export default OperatorPage;
