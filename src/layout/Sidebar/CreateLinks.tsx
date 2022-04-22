import { Route } from 'models/Routes';
import React from 'react';
import { v4 as uuid } from 'uuid';
import EntityNavButton from './EntityNavButton';
import NavLinkButton from './NavLinkButton';

const createLinks = (
  routes: Route[],
  activeRoute: (path: string, otherRoute: string | undefined) => string,
  role: string,
  toggleSidebar = () => {},
) =>
  routes.map((route) =>
    route.isEntity ? (
      <EntityNavButton key={uuid()} activeRoute={activeRoute} role={role} route={route} toggleSidebar={toggleSidebar} />
    ) : (
      <NavLinkButton key={uuid()} activeRoute={activeRoute} role={role} route={route} />
    ),
  );

export default createLinks;
