import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CCard, CCardBody } from '@coreui/react';
import { useEntity } from 'ucentral-libs';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';

const EntityPage = () => {
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
          <InventoryTable
            entity={entity}
            toggleAdd={toggleShowAdd}
            refreshId={refreshId}
            entityPage
          />
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
