import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthProvider';
import OperatorsTable from './Table';

const OperatorsPage: React.FC = () => {
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && <OperatorsTable />}
    </Flex>
  );
};

export default OperatorsPage;
