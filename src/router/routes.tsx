import React from 'react';
import { Icon } from '@chakra-ui/react';
import { Info, ListBullets, Storefront, Tag, TreeStructure, UsersThree } from 'phosphor-react';
import EntityNavButton from 'layout/Sidebar/EntityNavButton';
import { Route } from 'models/Routes';

const ConfigurationPage = React.lazy(() => import('pages/ConfigurationPage'));
const EntityPage = React.lazy(() => import('pages/EntityPage'));
const InventoryPage = React.lazy(() => import('pages/InventoryPage'));
const NotificationsPage = React.lazy(() => import('pages/Notifications'));
const MapPage = React.lazy(() => import('pages/MapPage'));
const ProfilePage = React.lazy(() => import('pages/Profile'));
const OperatorPage = React.lazy(() => import('pages/OperatorPage'));
const OperatorsPage = React.lazy(() => import('pages/OperatorsPage'));
const SubscriberPage = React.lazy(() => import('pages/SubscriberPage'));
const SystemPage = React.lazy(() => import('pages/SystemPage'));
const UsersPage = React.lazy(() => import('pages/UsersPage'));
const VenuePage = React.lazy(() => import('pages/VenuePage'));

const routes: Route[] = [
  {
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/entity/:id',
    name: 'entities.title',
    navName: 'entities.one',
    icon: (active: boolean) => (
      <Icon as={TreeStructure} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    navButton: (isActive: boolean, toggleSidebar: () => void, route: Route) => (
      <EntityNavButton isActive={isActive} toggleSidebar={toggleSidebar} route={route} />
    ),
    isEntity: true,
    component: EntityPage,
  },
  {
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/',
    name: 'inventory.title',
    icon: (active: boolean) => (
      <Icon as={Tag} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: InventoryPage,
  },
  {
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/operators',
    name: 'operator.other',
    icon: (active: boolean) => (
      <Icon as={Storefront} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: OperatorsPage,
  },
  {
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/logs',
    name: 'controller.devices.logs',
    icon: (active: boolean) => (
      <Icon as={ListBullets} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: NotificationsPage,
  },
  {
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/users',
    name: 'users.title',
    icon: (active: boolean) => (
      <Icon as={UsersThree} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: UsersPage,
  },
  {
    authorized: ['root', 'partner', 'admin'],
    path: '/system',
    name: 'system.title',
    icon: (active: boolean) => (
      <Icon as={Info} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: SystemPage,
  },
  {
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/venue/:id',
    name: 'venues.title',
    navName: 'venues.one',
    icon: (active: boolean) => (
      <Icon as={TreeStructure} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    isEntity: true,
    component: VenuePage,
  },
  {
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/account',
    name: 'account.title',
    icon: (active: boolean) => (
      <Icon as={UsersThree} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: ProfilePage,
  },
  {
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/configuration/:id',
    name: 'configurations.one',
    icon: (active: boolean) => (
      <Icon as={UsersThree} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: ConfigurationPage,
  },
  {
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/operators/:id',
    name: 'operator.one',
    icon: (active: boolean) => (
      <Icon as={UsersThree} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: OperatorPage,
  },
  {
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/subscriber/:id',
    name: 'subscribers.one',
    icon: (active: boolean) => (
      <Icon as={UsersThree} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: SubscriberPage,
  },
  {
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/map',
    name: 'common.map',
    icon: (active: boolean) => (
      <Icon as={UsersThree} color="inherit" h={active ? '32px' : '24px'} w={active ? '32px' : '24px'} />
    ),
    component: MapPage,
  },
];

export default routes;
