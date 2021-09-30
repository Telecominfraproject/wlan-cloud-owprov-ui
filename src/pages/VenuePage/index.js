import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import { useEntity, useToast } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';
import VenueInfoCard from 'components/VenueInfoCard';

const EntityPage = () => {
  const { t } = useTranslation();
  const { entity, setProviderEntity } = useEntity();
  const { venueId } = useParams();
  const { addToast } = useToast();
  const location = useLocation();
  const history = useHistory();
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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has('new')) {
      if (queryParams.get('new') === 'entity') {
        addToast({
          title: t('common.success'),
          body: t('entity.add_success'),
          color: 'success',
          autohide: true,
        });
      } else {
        addToast({
          title: t('common.success'),
          body: t('inventory.successful_venue_create'),
          color: 'success',
          autohide: true,
        });
      }
      queryParams.delete('new');
      history.replace({
        search: queryParams.toString(),
      });
    }
  }, [location]);

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
