import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CCard, CCardBody, CRow, CCol } from '@coreui/react';
import { useEntity } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';

const EntityPage = () => {
  const { t } = useTranslation();
  const { entity, setProviderEntity } = useEntity();
  const { entityId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshId, setRefreshId] = useState(0);

  const refreshTable = () => setRefreshId(refreshId + 1);

  const toggleShowAdd = () => {
    setShowAddModal(!showAddModal);
  };

  useEffect(() => {
    if (entityId !== null) {
      setProviderEntity(entityId);
    }
  }, [entityId]);

  return (
    <>
      <CCard>
        <CCardBody>{entity?.uuid}</CCardBody>
      </CCard>
      {entity !== null && entity?.uuid !== '0000-0000-0000' ? (
        <div>
          <CRow>
            <CCol sm={12} lg={6}>
              <InventoryTable
                entity={entity}
                toggleAdd={toggleShowAdd}
                refreshId={refreshId}
                refreshPageTables={refreshTable}
                onlyEntity
                urlId="only"
                title={t('inventory.tags_assigned_to', { name: entity.name })}
              />
            </CCol>
            <CCol sm={12} lg={6}>
              <InventoryTable
                entity={entity}
                refreshId={refreshId}
                refreshPageTables={refreshTable}
                urlId="unassigned"
                title={t('inventory.unassigned_tags')}
              />
            </CCol>
          </CRow>
          <AddInventoryTagModal
            show={showAddModal}
            toggle={toggleShowAdd}
            entity={entity}
            refreshTable={refreshTable}
          />
        </div>
      ) : (
        <div />
      )}
    </>
  );
};

export default EntityPage;
