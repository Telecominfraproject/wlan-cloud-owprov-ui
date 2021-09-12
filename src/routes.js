import React from 'react';

const EntityPage = React.lazy(() => import('pages/EntityPage'));
const VenuePage = React.lazy(() => import('pages/VenuePage'));
const InventoryPage = React.lazy(() => import('pages/InventoryPage'));
const ProfilePage = React.lazy(() => import('pages/ProfilePage'));
const SystemPage = React.lazy(() => import('pages/SystemPage'));
const ConfigurationPage = React.lazy(() => import('pages/ConfigurationPage'));
const ConfigurationDetailsPage = React.lazy(() => import('pages/ConfigurationDetailsPage'));

export default [
  { path: '/inventory', exact: true, name: 'Inventory', component: InventoryPage },
  { path: '/configuration', exact: true, name: 'Configuration', component: ConfigurationPage },
  {
    path: '/configuration/:configId',
    name: 'configuration.details',
    component: ConfigurationDetailsPage,
  },
  { path: '/venue/:venueId', exact: true, name: 'Venue', component: VenuePage },
  { path: '/entity/:entityId', name: 'Entity', component: EntityPage },
  { path: '/myprofile', exact: true, name: 'user.my_profile', component: ProfilePage },
  { path: '/system', exact: true, name: 'common.system', component: SystemPage },
];
