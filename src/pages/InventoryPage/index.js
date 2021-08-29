import React, { useState } from 'react';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';

const InventoryPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshId, setRefreshId] = useState(0);

  const toggleShowAdd = () => {
    setShowAddModal(!showAddModal);
  };

  const refreshTable = () => setRefreshId(refreshId + 1);

  return (
    <div>
      <InventoryTable
        entityPage={false}
        toggleAdd={toggleShowAdd}
        refreshId={refreshId}
        useUrl
        refreshPageTables={refreshTable}
      />
      <AddInventoryTagModal
        show={showAddModal}
        toggle={toggleShowAdd}
        refreshId={refreshId}
        refreshTable={refreshTable}
        entity={null}
      />
    </div>
  );
};

export default InventoryPage;
