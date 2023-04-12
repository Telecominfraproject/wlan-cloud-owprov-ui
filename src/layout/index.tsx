import React from 'react';
import { useBoolean, useBreakpoint, useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Navbar } from './Navbar';
import { PageContainer } from './PageContainer';
import { Sidebar } from './Sidebar';
import darkLogo from 'assets/Logo_Dark_Mode.svg';
import lightLogo from 'assets/Logo_Light_Mode.svg';
import LanguageSwitcher from 'components/LanguageSwitcher';
import { Route as RouteType } from 'models/Routes';
import NotFoundPage from 'pages/NotFound';
import routes from 'router/routes';

const Layout = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const location = useLocation();
  const breakpoint = useBreakpoint('xl');
  const [isSidebarOpen, { toggle: toggleSidebar }] = useBoolean(breakpoint !== 'base' && breakpoint !== 'sm');
  document.documentElement.dir = 'ltr';

  const activeRoute = React.useMemo(() => {
    const route = routes.find(
      (r) => r.path === location.pathname || location.pathname.split('/')[1] === r.path.split('/')[1],
    );

    if (route) return route.navName ? t(route.navName) : t(route.name);

    return '';
  }, [t, location.pathname]);

  const getRoutes = (r: RouteType[]) =>
    // @ts-ignore
    r.map((route: RouteType) => <Route path={route.path} element={<route.component />} key={uuid()} />);

  return (
    <>
      <Sidebar
        routes={routes}
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        version={__APP_VERSION__}
        logo={
          <img
            src={colorMode === 'light' ? lightLogo : darkLogo}
            alt="OpenWifi"
            width="180px"
            height="100px"
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        }
      />
      <Navbar toggleSidebar={toggleSidebar} languageSwitcher={<LanguageSwitcher />} activeRoute={activeRoute} />
      <PageContainer waitForUser>
        <Routes>
          {[...getRoutes(routes as RouteType[]), <Route path="*" element={<NotFoundPage />} key={uuid()} />]}
        </Routes>
      </PageContainer>
    </>
  );
};

export default Layout;
