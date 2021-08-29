import React from 'react';

const EntityPage = React.lazy(() => import('pages/EntityPage'));
const VenuesPage = React.lazy(() => import('pages/VenuesPage'));
const InventoryPage = React.lazy(() => import('pages/InventoryPage'));
const ProfilePage = React.lazy(() => import('pages/ProfilePage'));

export default [
  { path: '/inventory', exact: true, name: 'Inventory', component: InventoryPage },
  { path: '/venues', exact: true, name: 'Venues', component: VenuesPage },
  { path: '/entity/:entityId', name: 'Entity', component: EntityPage },
  { path: '/myprofile', exact: true, name: 'user.my_profile', component: ProfilePage },
];
