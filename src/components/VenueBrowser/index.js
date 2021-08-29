import React, { useEffect, useState } from 'react';
import { CCard, CCardHeader, CCardTitle, CCardBody, CRow, CCol, CButton } from '@coreui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  VenueBrowser as Browser,
  useAuth,
  useToast,
  useFormFields,
  EditVenueForm,
} from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import AddVenueModal from 'components/AddVenueModal';

const initialForm = {
  name: {
    value: '',
    error: false,
    required: true,
  },
  description: {
    value: '',
    error: false,
  },
  notes: {
    value: [],
    error: false,
  },
};

const VenueBrowser = ({ entity }) => {
  const { t } = useTranslation();
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [loadingVenue, setLoadingVenue] = useState(false);
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [activeVenue, setActiveVenue] = useState('');
  const [parent, setParent] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createParent, setCreateParent] = useState({});
  const [venue, setVenue] = useState(null);
  const [menuVenues, setMenuVenues] = useState([]);

  const validation = () => {
    let success = true;

    for (const [key, field] of Object.entries(fields)) {
      if (field.required && field.value === '') {
        updateField(key, { error: true });
        success = false;
        break;
      }
    }

    return success;
  };

  const refreshVenue = () => {
    setLoadingVenue(true);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/venue/${venue.id}`, options)
      .then((response) => {
        const newFields = fields;
        for (const [key] of Object.entries(newFields)) {
          if (response.data[key] !== undefined) {
            newFields[key].value = response.data[key];
          }
        }
        setFormFields({ ...newFields });
        setVenue(response.data.venues);
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('inventory.error_get_venue'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoadingVenue(false);
      });
  };

  const getMenuVenues = (ids) => {
    setLoadingMenu(true);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/venue?select=${ids.join(',')}`, options)
      .then((response) => {
        setMenuVenues(response.data.venues);
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('inventory.error_get_venue'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoadingMenu(true);
      });
  };

  const saveVenue = () => {
    if (validation()) {
      setLoadingVenue(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        id: venue.id,
        name: fields.name.value,
        description: fields.description.value,
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/venue/${venue.id}`, parameters, options)
        .then(() => {
          refreshVenue();
          addToast({
            title: t('common.success'),
            body: t('inventory.successful_venue_update'),
            color: 'success',
            autohide: true,
          });
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('inventory.error_update_venue'),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoadingVenue(false);
        });
    }
  };

  const addNote = (newNote) => {
    setLoadingVenue(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {
      notes: [{ note: newNote }],
    };

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/venue/${venue.id}`, parameters, options)
      .then(() => {
        refreshVenue();
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('common.error_adding_note'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoadingVenue(false);
      });
  };

  const toggleCreateModal = (parentId) => {
    setShowCreate(!showCreate);
    if (parentId) {
      setCreateParent({
        parent: parentId,
      });
    } else {
      setCreateParent({
        parent: activeVenue === '' ? undefined : activeVenue,
        entity: activeVenue === '' ? entity.uuid : undefined,
      });
    }
  };

  const getVenue = (id) => {
    if (id === '') {
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      axiosInstance
        .get(`${endpoints.owprov}/api/v1/entity/${entity.uuid}`, options)
        .then((response) => {
          setParent(null);
          getMenuVenues(response.data.venues);
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('inventory.error_get_venue'),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoadingVenue(false);
        });
    } else {
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      axiosInstance
        .get(`${endpoints.owprov}/api/v1/venue/${id}`, options)
        .then((response) => {
          setParent(response.data.parent);
          getMenuVenues(response.data.children);
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('inventory.error_get_venue'),
            color: 'danger',
            autohide: true,
          });
        });
    }
  };

  const refreshMenu = (parentId) => {
    getVenue(parentId);
    setActiveVenue(parentId);
    if (parentId === '') setParent(null);
  };

  const deleteVenue = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .delete(`${endpoints.owprov}/api/v1/venue/${venue.id}`, options)
      .then(() => {
        setVenue(null);
        refreshMenu(activeVenue);
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('common.error_adding_note'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoadingVenue(false);
      });
  };

  const selectVenue = (newVenue) => {
    setVenue(newVenue);
    const newFields = fields;
    for (const [key] of Object.entries(newFields)) {
      if (newVenue[key] !== undefined) {
        newFields[key].value = newVenue[key];
      }
    }
    setFormFields({ ...newFields });

    if (newVenue.children.length > 0) {
      setActiveVenue(newVenue.id);
      setParent(newVenue.parent);
      getMenuVenues(newVenue.children);
    }
  };

  useEffect(() => {
    if (entity && entity.venues?.length > 0) getMenuVenues(entity.venues);
  }, [entity]);

  return (
    <div>
      <CCard>
        <CCardHeader>
          <CCardTitle>{t('entity.venues')}</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <Browser
                t={t}
                loading={loadingMenu}
                venues={menuVenues}
                selectVenue={selectVenue}
                toggleCreate={toggleCreateModal}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol className="text-right">
              {parent === null ? null : (
                <CButton color="primary" onClick={() => refreshMenu(parent)}>
                  Go Back
                </CButton>
              )}
            </CCol>
          </CRow>
          <CRow hidden={venue === null}>
            <CCol className="text-center mb-3">
              <h5>{venue?.name}</h5>
            </CCol>
          </CRow>
          <CRow hidden={venue === null}>
            <CCol>
              <EditVenueForm
                t={t}
                disable={loadingVenue}
                fields={fields}
                updateField={updateFieldWithId}
                addNote={addNote}
              />
            </CCol>
          </CRow>
          <CRow hidden={venue === null}>
            <CCol hidden={venue?.children?.length > 0} className="text-right mt-2">
              <CButton color="primary" onClick={saveVenue}>
                {t('common.save')}
              </CButton>
            </CCol>
            <CCol className="text-right mt-2">
              <CButton color="primary" onClick={deleteVenue}>
                {t('common.delete')}
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <AddVenueModal
        show={showCreate}
        toggle={toggleCreateModal}
        parent={createParent}
        refreshMenu={refreshMenu}
      />
    </div>
  );
};

VenueBrowser.propTypes = {
  entity: PropTypes.instanceOf(Object).isRequired,
};

export default VenueBrowser;
