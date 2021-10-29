import React, { useState } from 'react';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';
import { CCard, CCardBody, CNav, CNavLink, CTabPane, CTabContent } from '@coreui/react';
import { useTranslation } from 'react-i18next';

const InventoryPage = () => {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshId, setRefreshId] = useState(0);
  const [index, setIndex] = useState(0);

  const toggleShowAdd = () => {
    setShowAddModal(!showAddModal);
  };

  const refreshTable = () => setRefreshId(refreshId + 1);

  return (
    <CCard>
      <CCardBody className="p-0">
        <CNav variant="tabs" className="mb-0 p-0">
          <CNavLink
            className="font-weight-bold"
            href="#"
            active={index === 0}
            onClick={() => setIndex(0)}
          >
            {t('entity.only_unassigned')}
          </CNavLink>
          <CNavLink
            className="font-weight-bold"
            href="#"
            active={index === 1}
            onClick={() => setIndex(1)}
          >
            {t('common.show_all')}
          </CNavLink>
        </CNav>
        <CTabContent>
          <CTabPane active={index === 0}>
            <InventoryTable
              title={t('inventory.title')}
              entityPage={false}
              toggleAdd={toggleShowAdd}
              refreshId={refreshId}
              useUrl
              refreshPageTables={refreshTable}
              onlyUnassigned
            />
          </CTabPane>
          <CTabPane active={index === 1}>
            <InventoryTable
              title={t('inventory.title')}
              entityPage={false}
              toggleAdd={toggleShowAdd}
              refreshId={refreshId}
              useUrl
              refreshPageTables={refreshTable}
            />
          </CTabPane>
        </CTabContent>
      </CCardBody>
      <AddInventoryTagModal
        show={showAddModal}
        toggle={toggleShowAdd}
        refreshId={refreshId}
        refreshTable={refreshTable}
        entity={null}
      />
    </CCard>
  );
};

export default InventoryPage;
