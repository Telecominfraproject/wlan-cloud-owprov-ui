import React, { LegacyRef, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useColorModeValue,
  useColorMode,
  Text,
  Spacer,
  useBreakpoint,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'contexts/AuthProvider';
import { Route } from 'models/Routes';
import darkLogo from 'assets/Logo_Dark_Mode.svg';
import lightLogo from 'assets/Logo_Light_Mode.svg';
import createLinks from './CreateLinks';

const variantChange = '0.2s linear';

interface Props {
  routes: Route[];
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<Props> = ({ routes, isOpen, toggle }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const mainPanel = useRef<unknown>();
  const { colorMode } = useColorMode();
  const navbarShadow = useColorModeValue('0px 7px 23px rgba(0, 0, 0, 0.05)', 'none');
  const breakpoint = useBreakpoint();

  const activeRoute = (routeName: string, otherRoute: string | undefined) => {
    if (otherRoute)
      return location.pathname.split('/')[1] === routeName.split('/')[1] ||
        location.pathname.split('/')[1] === otherRoute.split('/')[1]
        ? 'active'
        : '';

    return location.pathname === routeName ? 'active' : '';
  };

  const brand = (
    <Box pt="25px" mb="12px">
      <img src={colorMode === 'light' ? lightLogo : darkLogo} alt="OpenWifi" width="180px" height="100px" />
    </Box>
  );

  return (
    <>
      <Drawer isOpen={breakpoint === 'base' && isOpen} onClose={toggle} placement="left">
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          maxW="250px"
          ms={{
            base: '16px',
          }}
          my={{
            base: '16px',
          }}
          borderRadius="16px"
        >
          <DrawerCloseButton _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="90vh">
              <Box>{brand}</Box>
              <Flex direction="column" mb="40px" h="calc(100vh - 200px)" alignItems="center">
                <Box overflowY="auto">{createLinks(routes, activeRoute, user?.userRole ?? '', toggle)}</Box>
                <Spacer />
                <Box>
                  <Text color="gray.400">
                    {t('footer.version')} {process.env.REACT_APP_VERSION}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box ref={mainPanel as LegacyRef<HTMLDivElement> | undefined}>
        <Box hidden={!isOpen} position="fixed">
          <Box
            shadow={navbarShadow}
            bg={useColorModeValue('white', 'gray.700')}
            transition={variantChange}
            w="200px"
            maxW="200px"
            ms={{
              sm: '16px',
            }}
            my={{
              sm: '16px',
            }}
            h="calc(100vh - 32px)"
            ps="20px"
            pe="20px"
            m="16px 0px 16px 16px"
            borderRadius="16px"
          >
            <Box>{brand}</Box>
            <Flex direction="column" mb="40px" h="calc(100vh - 180px)" alignItems="center">
              <Box overflowY="auto">{createLinks(routes, activeRoute, user?.userRole ?? '', toggle)}</Box>
              <Spacer />
              <Box>
                <Text color="gray.400">
                  {t('footer.version')} {process.env.REACT_APP_VERSION}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
