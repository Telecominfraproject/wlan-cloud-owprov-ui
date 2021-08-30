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
  CRow,
  CCol,
  CPopover,
} from '@coreui/react';
import { cilList, cilSpreadsheet, cilWc, cilBank, cilSitemap } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import PropTypes from 'prop-types';
import { useEntity } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import DeleteEntityModal from 'components/DeleteEntityModal';
import AddEntityModal from 'components/AddEntityModal';
import EditEntityModal from 'components/EditEntityModal';
import SidebarDropdown from '../SidebarDropdown';
import SidebarChildless from '../SidebarChildless';
import styles from './index.module.scss';

const Sidebar = ({ showSidebar, setShowSidebar, logo, redirectTo }) => {
  const { t } = useTranslation();
  const { entity, entities, rootEntityMissing } = useEntity();
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const toggleAddEntity = () => {
    setShowAddEntity(!showAddEntity);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleDelete = () => {
    setShowDelete(!showDelete);
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
        <CRow hidden={rootEntityMissing || !entity} className="px-3">
          <CCol className="px-1">
            <CPopover content={t('entity.add_child', { entityName: entity?.name })}>
              <CButton
                hidden={!showSidebar}
                block
                className="text-center px-0 py-2 my-3"
                color="light"
                onClick={toggleAddEntity}
              >
                <CIcon content={cilSitemap} />
              </CButton>
            </CPopover>
          </CCol>
          <CCol className="px-1">
            <CPopover content={t('inventory.add_child_venue', { entityName: entity?.name })}>
              <CButton
                hidden={!showSidebar}
                block
                className="text-center px-0 py-2 my-3"
                color="light"
                onClick={toggleEdit}
              >
                <CIcon content={cilBank} />
              </CButton>
            </CPopover>
          </CCol>
        </CRow>
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
        <CSidebarNavDropdown
          name="Inventory"
          icon={<CIcon content={cilSpreadsheet} size="lg" className="mr-3" />}
        >
          <CSidebarNavItem name="Table" to="/inventory" />
        </CSidebarNavDropdown>
        <CSidebarNavDropdown
          name="Venues"
          icon={<CIcon content={cilList} size="lg" className="mr-3" />}
        >
          <CSidebarNavItem name="Table" to="/venues" />
        </CSidebarNavDropdown>
        <CSidebarNavDropdown
          name="Managament Roles"
          icon={<CIcon content={cilWc} size="lg" className="mr-3" />}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
      <AddEntityModal show={showAddEntity} toggle={toggleAddEntity} />
      <EditEntityModal show={showEdit} toggle={toggleEdit} entityUuid={entity?.uuid} />
      <DeleteEntityModal show={showDelete} toggle={toggleDelete} />
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
