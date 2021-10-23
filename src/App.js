import React from 'react';
import { HashRouter, Switch } from 'react-router-dom';
import 'scss/style.scss';
import Router from 'router';
import { AuthProvider, EntityProvider } from 'ucentral-libs';
import { checkIfJson } from 'utils/helper';
import { getItem } from 'utils/localStorageHelper';
import axiosInstance from 'utils/axiosInstance';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse" />
  </div>
);

const App = () => {
  const storageToken = getItem('access_token');
  const apiEndpoints = checkIfJson(getItem('gateway_endpoints'))
    ? JSON.parse(getItem('gateway_endpoints'))
    : {};

  return (
    <AuthProvider
      axiosInstance={axiosInstance}
      token={storageToken ?? ''}
      apiEndpoints={apiEndpoints}
    >
      <HashRouter>
        <EntityProvider axiosInstance={axiosInstance}>
          <React.Suspense fallback={loading}>
            <Switch>
              <Router />
            </Switch>
          </React.Suspense>
        </EntityProvider>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
