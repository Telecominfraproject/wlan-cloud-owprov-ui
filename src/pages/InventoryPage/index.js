import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthProvider';
import Table from './Table';

const InventoryPage = () => {
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && <Table />}
    </Flex>
  );
};

export default InventoryPage;
