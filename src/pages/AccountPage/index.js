import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthProvider';
import AccountCard from './AccountCard';

const AccountPage = () => {
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && <AccountCard />}
    </Flex>
  );
};

export default AccountPage;
