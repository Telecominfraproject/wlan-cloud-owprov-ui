import React from 'react';
import { Icon } from '@chakra-ui/react';
import { Info, Storefront, Tag, TreeStructure, UsersThree } from 'phosphor-react';
import { Route } from 'models/Routes';

const AccountPage = React.lazy(() => import('pages/AccountPage'));
const ConfigurationPage = React.lazy(() => import('pages/ConfigurationPage'));
const EntityPage = React.lazy(() => import('pages/EntityPage'));
const InventoryPage = React.lazy(() => import('pages/InventoryPage'));
const MapPage = React.lazy(() => import('pages/MapPage'));
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
    component: AccountPage,
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
