import React from 'react';

const EntityPage = React.lazy(() => import('pages/EntityPage'));
const VenuePage = React.lazy(() => import('pages/VenuePage'));
const InventoryPage = React.lazy(() => import('pages/InventoryPage'));
const ProfilePage = React.lazy(() => import('pages/ProfilePage'));

export default [
  { path: '/inventory', exact: true, name: 'Inventory', component: InventoryPage },
  { path: '/venue/:venueId', exact: true, name: 'Venue', component: VenuePage },
  { path: '/entity/:entityId', name: 'Entity', component: EntityPage },
  { path: '/myprofile', exact: true, name: 'user.my_profile', component: ProfilePage },
];
