import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import { useEntity } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';
import VenueInfoCard from 'components/VenueInfoCard';

const EntityPage = () => {
  const { t } = useTranslation();
  const { entity, setProviderEntity } = useEntity();
  const { venueId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshId, setRefreshId] = useState(0);

  const refreshTable = () => setRefreshId(refreshId + 1);

  const toggleShowAdd = () => {
    setShowAddModal(!showAddModal);
  };

  useEffect(() => {
    if (entity === null || (venueId !== null && entity.uuid !== venueId)) {
      setProviderEntity(venueId, true);
    }
  }, [venueId]);

  return (
    <>
      <CRow>
        <CCol>{entity === null || !entity.isVenue ? null : <VenueInfoCard />}</CCol>
      </CRow>
      <CRow>
        <CCol>
          {entity !== null && entity?.uuid !== '0000-0000-0000' && entity.isVenue ? (
            <div>
              <InventoryTable
                entity={entity}
                toggleAdd={toggleShowAdd}
                refreshId={refreshId}
                refreshPageTables={refreshTable}
                onlyEntity
                urlId="only"
                title={t('common.devices')}
              />
              <AddInventoryTagModal
                show={showAddModal}
                toggle={toggleShowAdd}
                refreshId={refreshId}
                entity={entity}
                refreshTable={refreshTable}
              />
            </div>
          ) : (
            <div />
          )}
        </CCol>
      </CRow>
    </>
  );
};

export default EntityPage;
