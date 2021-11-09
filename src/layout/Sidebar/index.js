import React, { useState } from 'react';
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CButton,
} from '@coreui/react';
import { cilBarcode, cilSpreadsheet, cilWc, cilMap } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import PropTypes from 'prop-types';
import { useEntity } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import AddEntityModal from 'components/AddEntityModal';
import SidebarDropdown from '../SidebarDropdown';
import SidebarChildless from '../SidebarChildless';
import styles from './index.module.scss';

const Sidebar = ({ showSidebar, setShowSidebar, logo, redirectTo }) => {
  const { t } = useTranslation();
  const { entities, rootEntityMissing, resetEntity } = useEntity();
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [creatingVenue, setCreatingVenue] = useState(false);

  const toggleAddEntity = (isVenue) => {
    if (isVenue !== undefined) setCreatingVenue(isVenue);
    setShowAddEntity(!showAddEntity);
  };

  return (
    <CSidebar
      show={showSidebar}
      onShowChange={(val) => setShowSidebar(val)}
      dropdownMode="noAction"
    >
      <CSidebarBrand className="d-md-down-none" to={redirectTo}>
        <img
          className={[styles.sidebarImgFull, 'c-sidebar-brand-full'].join(' ')}
          src={logo}
          alt="OpenWifi"
        />
        <img
          className={[styles.sidebarImgMinimized, 'c-sidebar-brand-minimized'].join(' ')}
          src={logo}
          alt="OpenWifi"
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CButton
          hidden={!showSidebar || !rootEntityMissing}
          block
          className="text-center px-0 py-2 my-3"
          color="light"
          onClick={toggleAddEntity}
        >
          {t('entity.add_root')}
        </CButton>
        <div hidden={rootEntityMissing}>
          <CCreateElement
            items={entities}
            components={{
              SidebarChildless,
              SidebarDropdown,
              CButton,
              CSidebarNavDivider,
              CSidebarNavDropdown,
              CSidebarNavItem,
              CSidebarNavTitle,
            }}
          />
        </div>
        <CSidebarNavItem
          name="Inventory"
          to="/inventory"
          onClick={resetEntity}
          icon={<CIcon content={cilSpreadsheet} size="lg" className="mr-3" />}
        />
        <CSidebarNavItem
          name="Contacts"
          to="/contacts"
          onClick={resetEntity}
          icon={<CIcon content={cilWc} size="lg" className="mr-3" />}
        />
        <CSidebarNavItem
          name="Locations"
          to="/location"
          onClick={resetEntity}
          icon={<CIcon content={cilMap} size="lg" className="mr-3" />}
        />
        <CSidebarNavItem
          name="Configurations"
          to="/configuration"
          onClick={resetEntity}
          icon={<CIcon content={cilBarcode} size="lg" className="mr-3" />}
        />
        <CSidebarNavDropdown
          hidden
          name="Managament Roles"
          icon={<CIcon content={cilWc} size="lg" className="mr-3" />}
        />
        <CSidebarNavItem
          name={t('user.users')}
          to="/users"
          icon="cilPeople"
          onClick={resetEntity}
        />
        <CSidebarNavItem
          name={t('common.system')}
          to="/system"
          icon="cilSettings"
          onClick={resetEntity}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
      <AddEntityModal show={showAddEntity} toggle={toggleAddEntity} creatingVenue={creatingVenue} />
    </CSidebar>
  );
};

Sidebar.propTypes = {
  showSidebar: PropTypes.string.isRequired,
  setShowSidebar: PropTypes.func.isRequired,
  logo: PropTypes.string.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

export default Sidebar;
