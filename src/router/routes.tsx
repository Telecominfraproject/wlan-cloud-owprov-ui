import React from 'react';
import { Info, ListBullets, Storefront, Tag, TreeStructure, UsersThree } from '@phosphor-icons/react';
import EntityNavigationButton from 'layout/Sidebar/EntityNavigationButton';
import { Route } from 'models/Routes';

const ConfigurationPage = React.lazy(() => import('pages/ConfigurationPage'));
const EntityPage = React.lazy(() => import('pages/EntityPage'));
const InventoryPage = React.lazy(() => import('pages/InventoryPage'));
const OpenRoamingPage = React.lazy(() => import('pages/OpenRoamingPage'));
const ProvLogsPage = React.lazy(() => import('pages/Notifications/GeneralLogs'));
const VenueNotificationsPage = React.lazy(() => import('pages/Notifications/Notifications'));
const FmsLogsPage = React.lazy(() => import('pages/Notifications/FmsLogs'));
const SecLogsPage = React.lazy(() => import('pages/Notifications/SecLogs'));
const MapPage = React.lazy(() => import('pages/MapPage'));
const ProfilePage = React.lazy(() => import('pages/Profile'));
const OperatorPage = React.lazy(() => import('pages/OperatorPage'));
const OperatorsPage = React.lazy(() => import('pages/OperatorsPage'));
const SubscriberPage = React.lazy(() => import('pages/SubscriberPage'));
const EndpointsPage = React.lazy(() => import('pages/EndpointsPage'));
const MonitoringPage = React.lazy(() => import('pages/MonitoringPage'));
const SystemConfigurationPage = React.lazy(() => import('pages/SystemConfigurationPage'));
const UsersPage = React.lazy(() => import('pages/UsersPage'));
const VenuePage = React.lazy(() => import('pages/VenuePage'));

const routes: Route[] = [
  {
    id: 'entity-page',
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/entity/:id',
    name: 'entities.title',
    navName: '',
    icon: () => <TreeStructure size={28} weight="bold" />,
    navButton: (_, toggleSidebar: () => void, route: Route) => (
      <EntityNavigationButton toggleSidebar={toggleSidebar} route={route} />
    ),
    isEntity: true,
    component: EntityPage,
  },
  {
    id: 'venue-page',
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/venue/:id',
    name: 'venues.title',
    navName: '',
    icon: () => <TreeStructure size={28} weight="bold" />,
    isEntity: true,
    component: VenuePage,
  },
  {
    id: 'inventory-page',
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/',
    name: 'inventory.title',
    icon: () => <Tag size={28} weight="bold" />,
    component: InventoryPage,
  },
  {
    id: 'operators-page',
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/operators',
    name: 'operator.other',
    icon: () => <Storefront size={28} weight="bold" />,
    component: OperatorsPage,
  },
  {
    id: 'logs-group',
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    name: 'controller.devices.logs',
    icon: () => <ListBullets size={28} weight="bold" />,
    children: [
      {
        id: 'logs-devices',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/logs/notifications',
        name: 'venues.title',
        navName: (t) => `${t('venues.one')} ${t('notification.other')}`,
        component: VenueNotificationsPage,
      },
      {
        id: 'logs-prov',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/logs/provisioning',
        name: 'controller.provisioning.title',
        navName: (t) => `${t('controller.provisioning.title')} ${t('controller.devices.logs')}`,
        component: ProvLogsPage,
      },
      {
        id: 'logs-security',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/logs/security',
        name: 'logs.security',
        navName: (t) => `${t('logs.security')} ${t('controller.devices.logs')}`,
        component: SecLogsPage,
      },
      {
        id: 'logs-firmware',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/logs/firmware',
        name: 'logs.firmware',
        navName: (t) => `${t('logs.firmware')} ${t('controller.devices.logs')}`,
        component: FmsLogsPage,
      },
    ],
  },
  {
    id: 'users-page',
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/users',
    name: 'users.title',
    icon: () => <UsersThree size={28} weight="bold" />,
    component: UsersPage,
  },
  {
    id: 'system-group',
    authorized: ['root', 'partner', 'admin'],
    name: 'system.title',
    icon: () => <Info size={28} weight="bold" />,
    children: [
      {
        id: 'system-configuration',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/systemConfiguration',
        name: 'system.configuration',
        component: SystemConfigurationPage,
      },
      {
        id: 'system-globalroaming',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/openRoaming',
        name: 'RAW-Open Roaming',
        label: 'Open Roaming',
        component: OpenRoamingPage,
      },
      {
        id: 'system-monitoring',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/systemMonitoring',
        name: 'analytics.monitoring',
        component: MonitoringPage,
      },
      {
        id: 'system-services',
        authorized: ['root', 'partner', 'admin', 'csr', 'system'],
        path: '/services',
        name: 'system.services',
        component: EndpointsPage,
      },
    ],
  },
  {
    id: 'account-page',
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/account',
    name: 'account.title',
    icon: () => <UsersThree size={28} weight="bold" />,
    component: ProfilePage,
  },
  {
    id: 'configuration-page',
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/configuration/:id',
    name: 'configurations.one',
    icon: () => <UsersThree size={28} weight="bold" />,
    component: ConfigurationPage,
  },
  {
    id: 'operator-page',
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/operators/:id',
    name: 'operator.one',
    icon: () => <UsersThree size={28} weight="bold" />,
    component: OperatorPage,
  },
  {
    id: 'subscriber-page',
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/subscriber/:id',
    name: 'subscribers.one',
    icon: () => <UsersThree size={28} weight="bold" />,
    component: SubscriberPage,
  },
  {
    id: 'map-page',
    hidden: true,
    authorized: ['root', 'partner', 'admin', 'csr', 'system'],
    path: '/map',
    name: 'common.map',
    icon: () => <UsersThree size={28} weight="bold" />,
    component: MapPage,
  },
];

export default routes;
