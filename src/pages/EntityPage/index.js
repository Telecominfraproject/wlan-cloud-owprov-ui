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
  const [refreshId, setRefreshId] = useState(0);

  const refreshTable = () => setRefreshId(refreshId + 1);

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
                refreshId={refreshId}
                refreshPageTables={refreshTable}
                onlyEntity
                title={t('entity.venues')}
              />
              <InventoryTable
                entity={entity}
                toggleAdd={toggleShowAddTag}
                refreshId={refreshId}
                refreshPageTables={refreshTable}
                onlyEntity
                title={t('common.devices')}
              />
              <AddInventoryTagModal
                show={showAddTagModal}
                toggle={toggleShowAddTag}
                refreshId={refreshId}
                entity={entity}
                refreshTable={refreshTable}
              />
              <AddEntityModal
                show={showAddVenueModal}
                toggle={toggleShowAddVenue}
                creatingVenue
                refresh={refreshTable}
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
