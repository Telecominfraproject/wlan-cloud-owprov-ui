import React from 'react';
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
import PropTypes from 'prop-types';
import SidebarDropdown from '../SidebarDropdown';
import styles from './index.module.scss';

const Sidebar = ({ showSidebar, setShowSidebar, logo, options, redirectTo, selected }) => (
  <CSidebar show={showSidebar} onShowChange={(val) => setShowSidebar(val)}>
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
      <CCreateElement
        items={options}
        components={{
          SidebarDropdown,
          CButton,
          CSidebarNavDivider,
          CSidebarNavDropdown,
          CSidebarNavItem,
          CSidebarNavTitle,
        }}
      />
    </CSidebarNav>
    <CButton size="lg" color="dark">
      Add to {selected}
    </CButton>
    <CSidebarMinimizer className="c-d-md-down-none" />
  </CSidebar>
);

Sidebar.propTypes = {
  showSidebar: PropTypes.string.isRequired,
  setShowSidebar: PropTypes.func.isRequired,
  logo: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(Object).isRequired,
  redirectTo: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
};

export default Sidebar;
