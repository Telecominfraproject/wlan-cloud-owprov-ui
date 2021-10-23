import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToggle } from 'ucentral-libs';
import LocationTable from 'components/LocationTable';
import AddLocationModal from 'components/AddLocationModal';

const LocationPage = () => {
  const { t } = useTranslation();
  const [showAddModal, toggleShowAdd] = useToggle(false);
  const [refreshId, setRefreshId] = useState(0);

  const refreshTable = () => setRefreshId(refreshId + 1);

  return (
    <div>
      <LocationTable
        title={t('location.title')}
        entityPage={false}
        toggleAdd={toggleShowAdd}
        refreshId={refreshId}
        useUrl
        refreshPageTables={refreshTable}
      />
      <AddLocationModal
        show={showAddModal}
        toggle={toggleShowAdd}
        refreshId={refreshId}
        refreshTable={refreshTable}
        entity={null}
      />
    </div>
  );
};

export default LocationPage;
