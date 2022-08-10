import React, { useState } from 'react';
import { ChevronDownIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  Avatar,
  MenuItem,
  MenuList,
  Heading,
  HStack,
  VStack,
  Text,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import routes from 'router/routes';
import { useAuth } from 'contexts/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { uppercaseFirstLetter } from 'utils/stringHelper';
import { ArrowCircleLeft, MapTrifold } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from 'components/LanguageSwitcher';

interface Props {
  secondary: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar: React.FC<Props> = ({ secondary, toggleSidebar, isSidebarOpen }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const { logout, user, avatar } = useAuth();
  const getActiveRoute = () => {
    const route = routes.find(
      (r) => r.path === location.pathname || location.pathname.split('/')[1] === r.path.split('/')[1],
    );

    if (route) return route.navName ?? route.name;

    return '';
  };

  // Style variables
  let navbarPosition: 'absolute' | 'fixed' = 'absolute';
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(21px)';
  let navbarShadow = 'none';
  let navbarBg = 'none';
  let navbarBorder = 'transparent';
  let secondaryMargin = '0px';

  // Values if scrolled
  const scrolledNavbarShadow = useColorModeValue('0px 7px 23px rgba(0, 0, 0, 0.05)', 'none');
  const scrolledNavbarBg = useColorModeValue(
    'linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)',
    'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)',
  );
  const scrolledNavbarBorder = useColorModeValue('#FFFFFF', 'rgba(255, 255, 255, 0.31)');
  const scrolledNavbarFilter = useColorModeValue('none', 'drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))');

  if (scrolled === true) {
    navbarPosition = 'fixed';
    navbarShadow = scrolledNavbarShadow;
    navbarBg = scrolledNavbarBg;
    navbarBorder = scrolledNavbarBorder;
    navbarFilter = scrolledNavbarFilter;
  }

  if (secondary) {
    navbarBackdrop = 'none';
    navbarPosition = 'absolute';
    secondaryMargin = '22px';
  }

  const goBack = () => navigate(-1);

  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const goToProfile = () => navigate('/account');
  const goToMap = () => navigate('/map');

  window.addEventListener('scroll', changeNavbar);

  return (
    <Flex
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems="center"
      borderRadius="16px"
      display="flex"
      minH="75px"
      justifyContent="center"
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      right={{ base: '0px', sm: '0px' }}
      pl="30px"
      ps="12px"
      pt="8px"
      top="18px"
      w={{
        base: '100%',
        sm: isSidebarOpen ? 'calc(100vw - 70px - 196px)' : '100%',
        md: isSidebarOpen ? 'calc(100vw - 70px - 196px)' : '100%',
      }}
    >
      <Flex w="100%" flexDirection="row" alignItems="center">
        <HamburgerIcon w="24px" h="24px" onClick={toggleSidebar} mr={10} mt={1} />
        <Heading>{t(getActiveRoute())}</Heading>
        <Tooltip label={t('common.go_back')}>
          <IconButton
            mt={2}
            ml={4}
            colorScheme="blue"
            aria-label={t('common.go_back')}
            onClick={goBack}
            icon={<ArrowCircleLeft width={20} height={20} />}
          />
        </Tooltip>
        <Box ms="auto" w={{ base: 'unset' }}>
          <Flex alignItems="center" flexDirection="row">
            <Tooltip hasArrow label={t('common.go_to_map')}>
              <IconButton
                aria-label={t('common.go_to_map')}
                variant="ghost"
                icon={<MapTrifold size={24} />}
                onClick={goToMap}
              />
            </Tooltip>
            <Tooltip hasArrow label={t('common.theme')}>
              <IconButton
                aria-label={t('common.theme')}
                variant="ghost"
                icon={colorMode === 'light' ? <MoonIcon h="20px" w="20px" /> : <SunIcon h="20px" w="20px" />}
                onClick={toggleColorMode}
              />
            </Tooltip>
            <LanguageSwitcher />
            <HStack spacing={{ base: '0', md: '6' }} ml={6} mr={4}>
              <Flex alignItems="center">
                <Menu>
                  <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                    <HStack>
                      <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing={0} height={12}>
                        <Text fontWeight="bold">{user?.name}</Text>
                        <Text fontSize="sm">{`${uppercaseFirstLetter(user?.userRole)}`}</Text>
                      </VStack>
                      <Avatar src={avatar} name={user?.name} />
                      <Box display={{ base: 'none', md: 'flex' }}>
                        <ChevronDownIcon />
                      </Box>
                    </HStack>
                  </MenuButton>
                  <MenuList
                    bg={useColorModeValue('white', 'gray.900')}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <MenuItem onClick={goToProfile} w="100%">
                      {t('account.title')}
                    </MenuItem>
                    <MenuItem onClick={logout}>{t('common.logout')}</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
