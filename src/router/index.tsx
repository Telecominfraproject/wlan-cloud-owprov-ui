import { useAuth } from 'contexts/AuthProvider';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Layout = React.lazy(() => import('layout'));
const Login = React.lazy(() => import('pages/LoginPage'));

const Router: React.FC = () => {
  const { token } = useAuth();

  return (
    <Routes>{token !== '' ? <Route path="/*" element={<Layout />} /> : <Route path="/*" element={<Login />} />}</Routes>
  );
};

export default Router;
