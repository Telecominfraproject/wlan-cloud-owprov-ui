import React, { useState, useEffect } from 'react';
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
  CRow,
  CCol,
  CPopover,
} from '@coreui/react';
import { cilPlus, cilPen, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import PropTypes from 'prop-types';
import { useEntity } from 'ucentral-libs';
import DeleteEntityModal from 'components/DeleteEntityModal';
import AddEntityModal from 'components/AddEntityModal';
import SidebarDropdown from '../SidebarDropdown';
import SidebarChildless from '../SidebarChildless';
import styles from './index.module.scss';

const Sidebar = ({
  showSidebar,
  setShowSidebar,
  logo,
  options,
  redirectTo,
  lastClickedUuid,
  refreshEntityChildren,
  deleteEntityFromSidebar,
}) => {
  const { entity, setEntity } = useEntity();
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const toggleAdd = () => {
    setShowAdd(!showAdd);
  };

  const toggleDelete = () => {
    setShowDelete(!showDelete);
  };

  useEffect(() => {
    setEntity(lastClickedUuid);
  }, [lastClickedUuid]);

  return (
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
        <CSidebarNavTitle className="pl-1">Entities</CSidebarNavTitle>
        <CCreateElement
          items={options}
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
      </CSidebarNav>
      <CRow className="px-3">
        <CCol>
          <CPopover content={`Add to ${entity.name}`}>
            <CButton
              hidden={!showSidebar}
              block
              className="text-center px-0 py-2 my-3"
              color="light"
              onClick={toggleAdd}
            >
              <CIcon content={cilPlus} />
            </CButton>
          </CPopover>
        </CCol>
        <CCol>
          <CPopover content={`Modify ${entity.name}`}>
            <CButton
              hidden={!showSidebar}
              block
              className="text-center px-0 py-2 my-3"
              color="light"
            >
              <CIcon content={cilPen} />
            </CButton>
          </CPopover>
        </CCol>
        <CCol>
          <CPopover content={`Delete ${entity.name}`}>
            <CButton
              hidden={!showSidebar}
              block
              className="text-center px-0 py-2 my-3"
              color="light"
              onClick={toggleDelete}
            >
              <CIcon content={cilTrash} />
            </CButton>
          </CPopover>
        </CCol>
      </CRow>
      <CSidebarMinimizer className="c-d-md-down-none" />
      <AddEntityModal
        show={showAdd}
        toggle={toggleAdd}
        refreshEntityChildren={refreshEntityChildren}
      />
      <DeleteEntityModal
        show={showDelete}
        toggle={toggleDelete}
        deleteEntityFromSidebar={deleteEntityFromSidebar}
      />
    </CSidebar>
  );
};

Sidebar.propTypes = {
  showSidebar: PropTypes.string.isRequired,
  setShowSidebar: PropTypes.func.isRequired,
  logo: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(Object).isRequired,
  redirectTo: PropTypes.string.isRequired,
  lastClickedUuid: PropTypes.instanceOf(Object).isRequired,
  refreshEntityChildren: PropTypes.func.isRequired,
  deleteEntityFromSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
