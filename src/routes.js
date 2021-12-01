import React from 'react';

const EntityPage = React.lazy(() => import('pages/EntityPage'));
const VenuePage = React.lazy(() => import('pages/VenuePage'));
const InventoryPage = React.lazy(() => import('pages/InventoryPage'));
const ContactsPage = React.lazy(() => import('pages/ContactsPage'));
const LocationPage = React.lazy(() => import('pages/LocationPage'));
const ProfilePage = React.lazy(() => import('pages/ProfilePage'));
const UserListPage = React.lazy(() => import('pages/UserListPage'));
const SystemPage = React.lazy(() => import('pages/SystemPage'));
const ConfigurationPage = React.lazy(() => import('pages/ConfigurationPage'));
const ConfigurationDetailsPage = React.lazy(() => import('pages/ConfigurationDetailsPage'));
const EntityMapPage = React.lazy(() => import('pages/EntityTreePage'));
const SubscriberPage = React.lazy(() => import('pages/SubscriberPage'));

export default [
  { path: '/inventory', exact: true, name: 'Inventory', component: InventoryPage },
  { path: '/contacts', exact: true, name: 'Contacts', component: ContactsPage },
  { path: '/location', exact: true, name: 'Locations', component: LocationPage },
  { path: '/configuration', exact: true, name: 'Configuration', component: ConfigurationPage },
  {
    path: '/configuration/:configId',
    name: 'configuration.details',
    component: ConfigurationDetailsPage,
  },
  { path: '/venue/:venueId', exact: true, name: 'Venue', component: VenuePage },
  { path: '/entity/:entityId', name: 'Entity', component: EntityPage },
  { path: '/myprofile', exact: true, name: 'user.my_profile', component: ProfilePage },
  { path: '/maps', exact: true, name: 'user.my_profile', component: EntityMapPage },
  { path: '/users', exact: true, name: 'user.users', component: UserListPage },
  { path: '/subscribers', exact: true, name: 'user.users', component: SubscriberPage },
  { path: '/system', exact: true, name: 'common.system', component: SystemPage },
];
