import React from 'react';
import { Flex } from '@chakra-ui/react';
import OperatorsTable from './Table';
import { useAuth } from 'contexts/AuthProvider';

const OperatorsPage = () => {
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && <OperatorsTable />}
    </Flex>
  );
};

export default OperatorsPage;
