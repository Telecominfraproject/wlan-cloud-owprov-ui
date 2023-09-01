import * as React from 'react';
import { Button, Flex, Text, useBreakpoint, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { ArrowCircleRight } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EntityNavigationModal from './Modal';
import IconBox from 'components/IconBox';
import { Route } from 'models/Routes';

const variantChange = '0.2s linear';

type Props = {
  route: Route;
  toggleSidebar: () => void;
};
const EntityNavigationButton = ({ route, toggleSidebar }: Props) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  const modalProps = useDisclosure();
  const inactiveArrowColor = useColorModeValue('var(--chakra-colors-gray-600)', 'var(--chakra-colors-gray-200)');
  const inactiveTextColor = useColorModeValue('gray.600', 'gray.200');
  const hoverBg = useColorModeValue('blue.100', 'blue.800');

  const navigateTo = React.useCallback(
    (id: string, type: 'venue' | 'entity') => {
      navigate(`/${type}/${id}`);
      modalProps.onClose();
      if (breakpoint === 'base' || breakpoint === 'sm' || breakpoint === 'md') toggleSidebar();
    },
    [breakpoint],
  );

  return (
    <>
      <EntityNavigationModal modalProps={modalProps} navigateTo={navigateTo} />
      <Button
        onClick={modalProps.onOpen}
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
    </>
  );
};

export default EntityNavigationButton;
