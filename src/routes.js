import React from 'react';

const HomePage = React.lazy(() => import('pages/HomePage'));
const ProfilePage = React.lazy(() => import('pages/ProfilePage'));

export default [
  { path: '/home', exact: true, name: 'Home', component: HomePage },
  { path: '/myprofile', exact: true, name: 'user.my_profile', component: ProfilePage },
];
