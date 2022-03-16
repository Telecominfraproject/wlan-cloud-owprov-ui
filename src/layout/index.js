import React, { Suspense } from 'react';
import { Flex, Portal, Spinner, useBoolean, useBreakpoint } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import routes from 'router/routes';
import MainPanel from './MainPanel';
import Navbar from './Navbar';
import PanelContent from './Containers/PanelContent';
import PanelContainer from './Containers/PanelContainer';
import Sidebar from './Sidebar';

const Layout = () => {
  const breakpoint = useBreakpoint();
  const [isSidebarOpen, { toggle: toggleSidebar }] = useBoolean(breakpoint !== 'base' && breakpoint !== 'sm');
  document.documentElement.dir = 'ltr';

  const getActiveRoute = (r) => {
    const activeRoute = 'Default Brand Text';
    for (let i = 0; i < r.length; i += 1) {
      if (r[i].collapse) {
        const collapseActiveRoute = getActiveRoute(r[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (r[i].category) {
        const categoryActiveRoute = getActiveRoute(r[i].views);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else if (window.location.href.indexOf(r[i].layout + r[i].path) !== -1) {
        return r[i].name;
      }
    }
    return activeRoute;
  };
  // This changes navbar state(fixed or not)
  const getActiveNavbar = (r) => {
    const activeNavbar = false;
    for (let i = 0; i < r.length; i += 1) {
      if (r[i].category) {
        const categoryActiveNavbar = getActiveNavbar(r[i].views);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else if (window.location.href.indexOf(r[i].path) !== -1) {
        if (r[i].secondaryNavbar) {
          return r[i].secondaryNavbar;
        }
      }
    }
    return activeNavbar;
  };
  const getRoutes = (r) => r.map((route) => <Route path={route.path} element={<route.component />} key={uuid()} />);

  return (
    <>
      <Sidebar
        routes={routes}
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        logoText="Provisioning"
        sidebarVariant="transparent"
      />
      <Portal>
        <Navbar
          brandText={getActiveRoute(routes)}
          secondary={getActiveNavbar(routes)}
          fixed
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </Portal>
      <MainPanel
        w={{
          base: '100%',
          sm: isSidebarOpen ? 'calc(100% - 220px)' : '100%',
          md: isSidebarOpen ? 'calc(100% - 220px)' : '100%',
        }}
      >
        <PanelContent>
          <PanelContainer>
            <Suspense
              fallback={
                <Flex flexDirection="column" pt="75px">
                  <Spinner />
                </Flex>
              }
            >
              <Routes>{getRoutes(routes)}</Routes>
            </Suspense>
          </PanelContainer>
        </PanelContent>
      </MainPanel>
    </>
  );
};

export default Layout;
