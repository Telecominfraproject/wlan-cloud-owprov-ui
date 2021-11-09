import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { CRow, CCol, CCard, CCardBody, CNav, CNavLink, CTabPane, CTabContent } from '@coreui/react';
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
  const { entity, setEntityId } = useEntity();
  const { entityId } = useParams();
  const { addToast } = useToast();
  const location = useLocation();
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const [showAddTagModal, toggleShowAddTag] = useToggle(false);
  const [showAddVenueModal, toggleShowAddVenue] = useToggle(false);
  const [showAddContact, toggleShowAddContact] = useToggle(false);
  const [showAddLocation, toggleShowAddLocation] = useToggle(false);

  const refreshTables = () => setEntityId(entityId, false);

  useEffect(() => {
    if (entity === null || !entity.extraData || Object.keys(entity.extraData).length === 0) {
      setEntityId(entityId, false);
    }
  }, []);

  useEffect(() => {
    if (entity?.id !== entityId) setEntityId(entityId, false);
  }, [entityId]);

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
              <CCard>
                <CCardBody className="p-0">
                  <CNav variant="tabs" className="mb-0 p-0">
                    <CNavLink
                      className="font-weight-bold"
                      href="#"
                      active={index === 0}
                      onClick={() => setIndex(0)}
                    >
                      {t('entity.venues')}
                    </CNavLink>
                    <CNavLink
                      className="font-weight-bold"
                      href="#"
                      active={index === 1}
                      onClick={() => setIndex(1)}
                    >
                      {t('common.devices')}
                    </CNavLink>
                    <CNavLink
                      className="font-weight-bold"
                      href="#"
                      active={index === 2}
                      onClick={() => setIndex(2)}
                    >
                      {t('contact.title')}
                    </CNavLink>
                    <CNavLink
                      className="font-weight-bold"
                      href="#"
                      active={index === 3}
                      onClick={() => setIndex(3)}
                    >
                      {t('location.title')}
                    </CNavLink>
                  </CNav>
                  <CTabContent>
                    <CTabPane active={index === 0}>
                      {index === 0 ? (
                        <VenuesTable
                          entity={entity}
                          toggleAdd={toggleShowAddVenue}
                          filterOnEntity
                          refreshPageTables={refreshTables}
                        />
                      ) : null}
                    </CTabPane>
                    <CTabPane active={index === 1}>
                      {index === 1 ? (
                        <InventoryTable
                          entity={entity}
                          toggleAdd={toggleShowAddTag}
                          refreshTable={refreshTables}
                          filterOnEntity
                        />
                      ) : null}
                    </CTabPane>
                    <CTabPane active={index === 2}>
                      {index === 2 ? (
                        <ContactsTable
                          entity={entity}
                          toggleAdd={toggleShowAddContact}
                          filterOnEntity
                          refreshPageTables={refreshTables}
                        />
                      ) : null}
                    </CTabPane>
                    <CTabPane active={index === 3}>
                      {index === 3 ? (
                        <LocationTable
                          entity={entity}
                          toggleAdd={toggleShowAddLocation}
                          filterOnEntity
                          refreshPageTables={refreshTables}
                        />
                      ) : null}
                    </CTabPane>
                  </CTabContent>
                </CCardBody>
              </CCard>
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
                refresh={refreshTables}
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
