import React, { useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import { useEntity, useToast, useToggle } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';
import VenueInfoCard from 'components/VenueInfoCard';

const EntityPage = () => {
  const { t } = useTranslation();
  const { entity, setEntityId } = useEntity();
  const { venueId } = useParams();
  const { addToast } = useToast();
  const location = useLocation();
  const history = useHistory();
  const [showAddModal, toggleShowAdd] = useToggle(false);

  const refreshTables = () => setEntityId(venueId, true);

  useEffect(() => {
    if (entity === null || !entity.extraData || Object.keys(entity.extraData).length === 0) {
      setEntityId(venueId, true);
    }
  }, []);

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

  useEffect(() => {
    if (entity?.id !== venueId) setEntityId(venueId, true);
  }, [venueId]);

  return (
    <>
      <CRow>
        <CCol>
          {entity === null || !entity.isVenue ? null : (
            <VenueInfoCard refreshPage={refreshTables} />
          )}
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          {entity !== null && entity.isVenue ? (
            <div>
              <InventoryTable
                entity={entity}
                toggleAdd={toggleShowAdd}
                refreshTable={refreshTables}
                filterOnEntity
                urlId="only"
                title={t('common.devices')}
              />
              <AddInventoryTagModal
                show={showAddModal}
                toggle={toggleShowAdd}
                entity={entity}
                refreshTable={refreshTables}
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
