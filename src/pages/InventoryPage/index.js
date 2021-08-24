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
      <InventoryTable entityPage={false} toggleAdd={toggleShowAdd} refreshId={refreshId} />
      <AddInventoryTagModal
        show={showAddModal}
        toggle={toggleShowAdd}
        refreshTable={refreshTable}
      />
    </div>
  );
};

export default InventoryPage;
