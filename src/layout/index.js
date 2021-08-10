import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import routes from 'routes';
import { Header, Sidebar, Footer, PageContainer, ToastProvider, useAuth } from 'ucentral-libs';

const TheLayout = () => {
  const [showSidebar, setShowSidebar] = useState('responsive');
  const { endpoints, currentToken, user, avatar, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const navigation = [
    {
      _tag: 'CSidebarNavItem',
      name: 'Home',
      to: '/home',
      icon: 'cilHome',
    },
  ];

  return (
    <div className="c-app c-default-layout">
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        logo="assets/OpenWiFi_LogoLockup_WhiteColour.svg"
        options={navigation}
        redirectTo="/devices"
      />
      <div className="c-wrapper">
        <Header
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          routes={routes}
          t={t}
          i18n={i18n}
          logout={logout}
          logo="assets/OpenWiFi_LogoLockup_DarkGreyColour.svg"
          authToken={currentToken}
          endpoints={endpoints}
          user={user}
          avatar={avatar}
        />
        <div className="c-body">
          <ToastProvider>
            <PageContainer t={t} routes={routes} redirectTo="/home" />
          </ToastProvider>
        </div>
        <Footer t={t} version="0.8.0" />
      </div>
    </div>
  );
};

export default TheLayout;
