import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthProvider';
import UserTable from './Table';

const UsersPage = () => {
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && <UserTable />}
    </Flex>
  );
};

export default UsersPage;
