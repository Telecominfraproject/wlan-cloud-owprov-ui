import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import { useEntity } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';
import AddEntityModal from 'components/AddEntityModal';
import EntityInfoCard from 'components/EntityInfoCard';
import VenuesTable from 'components/VenuesTable';

const EntityPage = () => {
  const { t } = useTranslation();
  const { entity, setProviderEntity } = useEntity();
  const { entityId } = useParams();
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showAddVenueModal, setShowAddVenueModal] = useState(false);
  const [inventoryRefreshId, setInventoryRefreshId] = useState(0);
  const [venueRefreshId, setVenueRefreshId] = useState(0);

  const refreshVenues = () => setVenueRefreshId(venueRefreshId + 1);

  const refreshInventory = () => setInventoryRefreshId(inventoryRefreshId + 1);

  const toggleShowAddTag = () => setShowAddTagModal(!showAddTagModal);

  const toggleShowAddVenue = () => setShowAddVenueModal(!showAddVenueModal);

  useEffect(() => {
    if (entity === null || (entityId !== null && entity.uuid !== entityId)) {
      setProviderEntity(entityId, false);
    }
  }, [entityId]);

  return (
    <>
      <CRow>
        <CCol>{entity === null || entity.isVenue ? null : <EntityInfoCard />}</CCol>
      </CRow>
      <CRow>
        <CCol>
          {entity !== null && entity?.uuid !== '0000-0000-0000' && !entity.isVenue ? (
            <div>
              <VenuesTable
                entity={entity}
                toggleAdd={toggleShowAddVenue}
                refreshId={venueRefreshId}
                refresh={refreshVenues}
                onlyEntity
                title={t('entity.venues')}
              />
              <InventoryTable
                entity={entity}
                toggleAdd={toggleShowAddTag}
                refreshId={inventoryRefreshId}
                refreshPageTables={refreshInventory}
                onlyEntity
                title={t('common.devices')}
              />
              <AddInventoryTagModal
                show={showAddTagModal}
                toggle={toggleShowAddTag}
                refreshId={inventoryRefreshId}
                entity={entity}
                refreshTable={refreshInventory}
              />
              <AddEntityModal
                show={showAddVenueModal}
                toggle={toggleShowAddVenue}
                creatingVenue
                refresh={refreshVenues}
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
