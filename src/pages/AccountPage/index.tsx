import React from 'react';
import { Flex } from '@chakra-ui/react';
import AccountCard from './AccountCard';
import { useAuth } from 'contexts/AuthProvider';

const AccountPage: React.FC = () => {
  const { isUserLoaded } = useAuth();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && <AccountCard />}
    </Flex>
  );
};

export default AccountPage;
