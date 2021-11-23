import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Footer, PageContainer, ToastProvider, useAuth } from 'ucentral-libs';
import { CButton, CPopover } from '@coreui/react';
import { cilGlobeAlt } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import routes from 'routes';
import { useHistory } from 'react-router-dom';
import Sidebar from './Sidebar';

const TheLayout = () => {
  const { t, i18n } = useTranslation();
  const { endpoints, currentToken, user, avatar, logout } = useAuth();
  const history = useHistory();
  const [showSidebar, setShowSidebar] = useState('responsive');
  return (
    <div className="c-app c-default-layout">
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        logo="assets/OpenWiFi_LogoLockup_WhiteColour.svg"
        redirectTo="/entity/0000-0000-0000"
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
          extraButton={
            <CPopover content={t('entity.entire_tree')}>
              <CButton color="info" onClick={() => history.push(`/maps`)} className="ml-2">
                <CIcon content={cilGlobeAlt} />
              </CButton>
            </CPopover>
          }
          hideBreadcrumb
        />
        <div className="c-body">
          <ToastProvider>
            <PageContainer t={t} routes={routes} redirectTo="/entity/0000-0000-0000" />
          </ToastProvider>
        </div>
        <Footer t={t} version={process.env.VERSION} />
      </div>
    </div>
  );
};

export default TheLayout;
