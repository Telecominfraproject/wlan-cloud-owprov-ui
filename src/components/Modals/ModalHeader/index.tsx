import React from 'react';
import { HStack, ModalHeader as Header, Spacer, useColorModeValue } from '@chakra-ui/react';

interface ModalHeaderProps {
  title: string;
  left?: React.ReactNode;
  right: React.ReactNode;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, left, right }) => {
  const bg = useColorModeValue('blue.50', 'blue.700');

  return (
    <Header bg={bg}>
      {title}
      {left ? (
        <HStack spacing={2} ml={2}>
          {left}
        </HStack>
      ) : null}
      <Spacer />
      {right}
    </Header>
  );
};

export default ModalHeader;
