import React from 'react';
import { Flex } from '@chakra-ui/react';
import Table from './Table';
import { useAuth } from 'contexts/AuthProvider';

const InventoryPage = () => {
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && <Table />}
    </Flex>
  );
};

export default InventoryPage;
