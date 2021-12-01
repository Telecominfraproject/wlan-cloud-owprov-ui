import React, { useState } from 'react';
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CButton,
} from '@coreui/react';
import {
  cilBarcode,
  cilSpreadsheet,
  cilWc,
  cilMap,
  cilSettings,
  cilPeople,
  cilAddressBook,
} from '@coreui/icons';
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
          className="font-weight-bold"
          name="Inventory"
          to="/inventory"
          onClick={resetEntity}
          icon={<CIcon content={cilSpreadsheet} size="xl" className="mr-3" />}
        />
        <CSidebarNavItem
          className="font-weight-bold"
          name="Contacts"
          to="/contacts"
          onClick={resetEntity}
          icon={<CIcon content={cilWc} size="xl" className="mr-3" />}
        />
        <CSidebarNavItem
          className="font-weight-bold"
          name="Locations"
          to="/location"
          onClick={resetEntity}
          icon={<CIcon content={cilMap} size="xl" className="mr-3" />}
        />
        <CSidebarNavItem
          className="font-weight-bold"
          name="Configurations"
          to="/configuration"
          onClick={resetEntity}
          icon={<CIcon content={cilBarcode} size="xl" className="mr-3" />}
        />
        <CSidebarNavDropdown
          className="font-weight-bold"
          hidden
          name="Managament Roles"
          icon={<CIcon content={cilWc} size="xl" className="mr-3" />}
        />
        <CSidebarNavItem
          className="font-weight-bold"
          name="Subscribers"
          to="/subscribers"
          icon={<CIcon content={cilAddressBook} size="xl" className="mr-3" />}
          onClick={resetEntity}
        />
        <CSidebarNavItem
          className="font-weight-bold"
          name={t('user.users')}
          to="/users"
          icon={<CIcon content={cilPeople} size="xl" className="mr-3" />}
          onClick={resetEntity}
        />
        <CSidebarNavItem
          className="font-weight-bold"
          name={t('common.system')}
          to="/system"
          icon={<CIcon content={cilSettings} size="xl" className="mr-3" />}
          onClick={resetEntity}
        />
      </CSidebarNav>
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
