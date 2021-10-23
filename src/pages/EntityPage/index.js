import React, { useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import { useEntity, useToast, useToggle } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';
import AddEntityModal from 'components/AddEntityModal';
import EntityInfoCard from 'components/EntityInfoCard';
import VenuesTable from 'components/VenuesTable';
import ContactsTable from 'components/ContactsTable';
import AddContactModal from 'components/AddContactModal';
import LocationTable from 'components/LocationTable';
import AddLocationModal from 'components/AddLocationModal';

const EntityPage = () => {
  const { t } = useTranslation();
  const { entity, setProviderEntity } = useEntity();
  const { entityId } = useParams();
  const { addToast } = useToast();
  const location = useLocation();
  const history = useHistory();
  const [showAddTagModal, toggleShowAddTag] = useToggle(false);
  const [showAddVenueModal, toggleShowAddVenue] = useToggle(false);
  const [showAddContact, toggleShowAddContact] = useToggle(false);
  const [showAddLocation, toggleShowAddLocation] = useToggle(false);

  const refreshTables = () => setProviderEntity(entityId, false);

  useEffect(() => {
    if (entity === null || !entity.extraData || Object.keys(entity.extraData).length === 0) {
      setProviderEntity(entityId, false);
    }
  }, [entityId]);

  useEffect(() => {
    if (entity === null || !entity.extraData || Object.keys(entity.extraData).length === 0) {
      setProviderEntity(entityId, false);
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

  return (
    <>
      <CRow>
        <CCol>
          {entity === null || entity.isVenue ? null : (
            <EntityInfoCard refreshPage={refreshTables} />
          )}
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          {entityId !== null &&
          entity !== null &&
          entity.uuid === entityId &&
          entity.uuid !== '0000-0000-0000' &&
          !entity.isVenue ? (
            <div>
              <VenuesTable
                entity={entity}
                toggleAdd={toggleShowAddVenue}
                filterOnEntity
                title={t('entity.venues')}
                refreshPageTables={refreshTables}
              />
              <InventoryTable
                entity={entity}
                toggleAdd={toggleShowAddTag}
                refreshTable={refreshTables}
                filterOnEntity
                title={t('common.devices')}
              />
              <ContactsTable
                entity={entity}
                toggleAdd={toggleShowAddContact}
                filterOnEntity
                title={t('contact.title')}
                refreshPageTables={refreshTables}
              />
              <LocationTable
                entity={entity}
                toggleAdd={toggleShowAddLocation}
                filterOnEntity
                title={t('location.title')}
                refreshPageTables={refreshTables}
              />
              <AddInventoryTagModal
                show={showAddTagModal}
                toggle={toggleShowAddTag}
                entity={entity}
                refreshTable={refreshTables}
              />
              <AddEntityModal
                show={showAddVenueModal}
                toggle={toggleShowAddVenue}
                creatingVenue
                refreshTable={refreshTables}
              />
              <AddContactModal
                show={showAddContact}
                toggle={toggleShowAddContact}
                entity={entity}
                refreshTable={refreshTables}
              />
              <AddLocationModal
                show={showAddLocation}
                toggle={toggleShowAddLocation}
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
