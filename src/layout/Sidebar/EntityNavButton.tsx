import React from 'react';
import { Button, Flex, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { ArrowCircleRight } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import EntityPopover from './EntityPopover';
import IconBox from 'components/IconBox';
import { Route } from 'models/Routes';

const variantChange = '0.2s linear';

interface Props {
  isActive: boolean;
  route: Route;
  toggleSidebar: () => void;
}

const EntityNavButton = ({ isActive, route, toggleSidebar }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const activeArrowColor = useColorModeValue('var(--chakra-colors-gray-700)', 'white');
  const inactiveArrowColor = useColorModeValue('var(--chakra-colors-gray-600)', 'var(--chakra-colors-gray-200)');
  const activeTextColor = useColorModeValue('gray.700', 'white');
  const inactiveTextColor = useColorModeValue('gray.600', 'gray.200');
  const hoverBg = useColorModeValue('blue.100', 'blue.800');

  return (
    <EntityPopover isOpen={isOpen} onClose={onClose} toggleSidebar={toggleSidebar}>
      {isActive ? (
        <Button
          onClick={onOpen}
          boxSize="initial"
          justifyContent="flex-start"
          alignItems="center"
          boxShadow="none"
          bg="transparent"
          transition={variantChange}
          mx="auto"
          px={1}
          py="12px"
          borderRadius="15px"
          w="100%"
          _active={{
            bg: 'inherit',
            transform: 'none',
            borderColor: 'transparent',
          }}
          _focus={{
            boxShadow: '0px 7px 11px rgba(0, 0, 0, 0.04)',
          }}
          _hover={{
            bg: hoverBg,
          }}
          borderWidth="0px"
          rightIcon={<ArrowCircleRight size={24} color={activeArrowColor} />}
        >
          <Flex alignItems="center" w="100%">
            <IconBox color="blue.300" h="30px" w="30px" me="6px" transition={variantChange} fontWeight="bold">
              {route.icon(false)}
            </IconBox>
            <Text color={activeTextColor} fontSize="md" fontWeight="bold">
              {t(route.name)}
            </Text>
          </Flex>
        </Button>
      ) : (
        <Button
          onClick={onOpen}
          boxSize="initial"
          justifyContent="flex-start"
          alignItems="center"
          bg="transparent"
          mx="auto"
          py="12px"
          ps={1}
          borderRadius="15px"
          w="100%"
          _active={{
            bg: 'inherit',
            transform: 'none',
            borderColor: 'transparent',
          }}
          _focus={{
            boxShadow: 'none',
          }}
          _hover={{
            bg: hoverBg,
          }}
          borderWidth="0px"
          rightIcon={<ArrowCircleRight size={20} color={inactiveArrowColor} />}
        >
          <Flex alignItems="center" w="100%">
            <IconBox color="blue.300" h="30px" w="30px" me="6px" transition={variantChange} fontWeight="bold">
              {route.icon(false)}
            </IconBox>
            <Text color={inactiveTextColor} fontSize="md" fontWeight="bold">
              {t(route.name)}
            </Text>
          </Flex>
        </Button>
      )}
    </EntityPopover>
  );
};

export default React.memo(EntityNavButton);
