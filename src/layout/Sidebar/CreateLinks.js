import React from 'react';
import { v4 as createUuid } from 'uuid';
import EntityNavButton from './EntityNavButton';
import NavLinkButton from './NavLinkButton';

const createLinks = (routes, activeRoute, role, toggleSidebar = () => {}) =>
  routes.map((route) =>
    route.isEntity ? (
      <EntityNavButton
        key={createUuid()}
        activeRoute={activeRoute}
        role={role}
        route={route}
        toggleSidebar={toggleSidebar}
      />
    ) : (
      <NavLinkButton key={createUuid()} activeRoute={activeRoute} role={role} route={route} />
    ),
  );

export default createLinks;
