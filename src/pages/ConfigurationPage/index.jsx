import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import ConfigurationCard from './ConfigurationCard';
import { useAuth } from 'contexts/AuthProvider';

const ConfigurationPage = () => {
  const { isUserLoaded } = useAuth();
  const { id } = useParams();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && id !== '' && <ConfigurationCard id={id} />}
    </Flex>
  );
};

export default ConfigurationPage;
