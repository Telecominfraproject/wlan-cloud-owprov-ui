import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import {
  CButton,
  CCardBody,
  CCard,
  CCardHeader,
  CPopover,
  CButtonToolbar,
  CSelect,
} from '@coreui/react';
import { cilPlus, cilSync } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useAuth, useToast, LocationTable as Table } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { getItem, setItem } from 'utils/localStorageHelper';
import EditLocationModal from 'components/EditLocationModal';

const LocationTable = ({
  entity,
  toggleAdd,
  refreshId,
  filterOnEntity,
  useUrl,
  title,
  refreshPageTables,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentToken, endpoints } = useAuth();
  const history = useHistory();
  const path = history.location.pathname.split('?')[0];
  const { search } = useLocation();
  const page = new URLSearchParams(search).get('page');
  const [localPage, setLocalPage] = useState('0');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  // States needed for Inventory Table
  const [loading, setLoading] = useState(false);
  const [locationCount, setLocationCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [locationsPerPage, setLocationsPerPage] = useState(getItem('locationsPerPage') || '10');
  const [locations, setLocations] = useState([]);
  const [entityLocationsArray, setEntityLocationsArray] = useState([]);

  const toggleEditModal = (locationId) => {
    setSelectedLocationId(locationId);
    setShowEditModal(!showEditModal);
  };

  const getLocationInformation = (selectedPage = page, locationPerPage = locationsPerPage) => {
    setLoading(true);

    let params = {};

    if (filterOnEntity) {
      params = {
        select: entity.extraData.locations
          .slice(locationPerPage * selectedPage, locationPerPage)
          .join(','),
        withExtendedInfo: true,
      };
    } else {
      params = {
        withExtendedInfo: true,
        limit: locationPerPage,
        offset: locationPerPage * selectedPage + 1,
      };
    }

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      params,
    };

    let newLocations = [];

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/location`, options)
      .then((response) => {
        newLocations = response.data.locations;
        setLocations(newLocations);
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('location.error_fetching_list'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const getCount = () => {
    setLoading(true);

    if (filterOnEntity) {
      if (entity.extraData?.locations) {
        const locationsCount = entity.extraData.locations.length;
        const pagesCount = Math.ceil(locationsCount / locationsPerPage);
        setPageCount(pagesCount);
        setLocationCount(locationsCount);

        let selectedPage = page;

        if (page >= pagesCount) {
          if (useUrl) history.push(`${path}?page=${pagesCount - 1}`);
          else setLocalPage(`${pagesCount - 1}`);
          selectedPage = pagesCount - 1;
        }
        if (locationsCount > 0) {
          getLocationInformation(selectedPage);
        } else {
          setLocations([]);
          setLoading(false);
        }
      } else {
        setLocations([]);
        setLoading(false);
      }
    } else {
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      };

      const params = {
        countOnly: true,
      };

      axiosInstance
        .get(`${endpoints.owprov}/api/v1/location`, {
          headers,
          params,
        })
        .then((response) => {
          const locationsCount = response.data.count;
          const pagesCount = Math.ceil(locationsCount / locationsPerPage);
          setPageCount(pagesCount);
          setLocationCount(locationsCount);

          let selectedPage = page;

          if (page >= pagesCount) {
            if (useUrl) history.push(`${path}?page=${pagesCount - 1}`);
            else setLocalPage(`${pagesCount - 1}`);
            selectedPage = pagesCount - 1;
          }
          if (locationsCount > 0) {
            getLocationInformation(selectedPage);
          } else {
            setLocations([]);
            setLoading(false);
          }
        })
        .catch(() => {
          setLocations([]);
          setLoading(false);
        });
    }
  };

  const updateLocationsPerPage = (value) => {
    setItem('locationsPerPage', value);
    setLocationsPerPage(value);

    const newPageCount = Math.ceil(locationCount / value);
    setPageCount(newPageCount);

    let selectedPage = page;

    if (page >= newPageCount) {
      if (useUrl) history.push(`${path}?page=${newPageCount - 1}`);
      else setLocalPage(`${newPageCount - 1}`);
      selectedPage = newPageCount - 1;
    }

    getLocationInformation(selectedPage, value);
  };

  const updatePage = ({ selected: selectedPage }) => {
    if (useUrl) history.push(`${path}?page=${selectedPage}`);
    else setLocalPage(`${selectedPage}`);

    getLocationInformation(selectedPage);
  };

  const unassignLocation = (serialNumber) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {};

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/location/${serialNumber}?unassign=true`, parameters, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('location.successful_unassign'),
          color: 'success',
          autohide: true,
        });
        if (refreshPageTables !== null) refreshPageTables();
        else getCount();
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('location.error_unassign'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const assignLocation = (id) => {
    if (entity !== null) {
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        entity: entity.isVenue ? undefined : entity.uuid,
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/location/${id}`, parameters, options)
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('location.successful_assign'),
            color: 'success',
            autohide: true,
          });
          if (refreshPageTables !== null) refreshPageTables();
          else getCount();
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('location.error_assign', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const deleteLocation = (id) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .delete(`${endpoints.owprov}/api/v1/location/${id}`, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('location.successful_delete'),
          color: 'success',
          autohide: true,
        });
        if (refreshPageTables !== null) refreshPageTables();
        else getCount();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('location.error_delete', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refresh = () => {
    getCount();
    if (refreshPageTables !== null) refreshPageTables();
  };

  useEffect(() => {
    if ((useUrl && page === undefined) || page === null || Number.isNaN(page)) {
      history.push(`${path}?page=0`);
    }
    if (!useUrl) setLocalPage('0');

    if (entity === null) setEntityLocationsArray([]);
    else {
      const newLocations =
        entity?.extraData?.locations !== undefined
          ? entity.extraData?.locations?.map((d) => d)
          : [];
      if (newLocations.join(',') !== entityLocationsArray.join(','))
        setEntityLocationsArray(newLocations);
    }
  }, [entity]);

  useEffect(() => {
    getCount();
  }, [entityLocationsArray]);

  useEffect(() => {
    if ((useUrl && page === undefined) || page === null || Number.isNaN(page)) {
      history.push(`${path}?page=0`);
    }
    if (!useUrl) setLocalPage('0');

    getCount();
  }, []);

  useEffect(() => {
    if (refreshId > 0) getCount();
  }, [refreshId]);

  return (
    <div>
      <CCard className="my-0 py-0">
        <CCardHeader className="dark-header">
          <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
            {title}
          </div>
          <div className="pl-3 float-right">
            <CButtonToolbar role="group" className="justify-content-end">
              <CPopover content={t('location.create')}>
                <CButton color="info" onClick={toggleAdd}>
                  <CIcon content={cilPlus} />
                </CButton>
              </CPopover>
              <CPopover content={t('common.refresh')}>
                <CButton color="info" onClick={refresh} className="ml-2">
                  <CIcon content={cilSync} />
                </CButton>
              </CPopover>
            </CButtonToolbar>
          </div>
        </CCardHeader>
        <CCardBody className="p-0">
          <Table
            t={t}
            loading={loading}
            entity={entity}
            filterOnEntity={filterOnEntity}
            locations={locations}
            unassign={unassignLocation}
            assignToEntity={assignLocation}
            toggleEditModal={toggleEditModal}
            deleteLocation={deleteLocation}
            perPageSwitcher={
              <div style={{ width: '100px' }} className="float-left px-2">
                <CSelect
                  custom
                  defaultValue={locationsPerPage}
                  onChange={(e) => updateLocationsPerPage(e.target.value)}
                  disabled={loading}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </CSelect>
              </div>
            }
            pageSwitcher={
              <div className="float-left pr-3">
                <ReactPaginate
                  previousLabel="← Previous"
                  nextLabel="Next →"
                  pageCount={pageCount}
                  onPageChange={updatePage}
                  forcePage={Number(useUrl ? page : localPage)}
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  activeClassName="active"
                />
              </div>
            }
          />
        </CCardBody>
      </CCard>
      <EditLocationModal
        show={showEditModal}
        toggle={toggleEditModal}
        editEntity={entity !== null}
        locationId={selectedLocationId}
        refreshTable={refreshPageTables ?? getCount}
      />
    </div>
  );
};

LocationTable.propTypes = {
  entity: PropTypes.instanceOf(Object),
  toggleAdd: PropTypes.func,
  refreshId: PropTypes.number,
  filterOnEntity: PropTypes.bool,
  useUrl: PropTypes.bool,
  title: PropTypes.string,
  refreshPageTables: PropTypes.func,
};

LocationTable.defaultProps = {
  entity: null,
  toggleAdd: null,
  refreshId: 0,
  filterOnEntity: false,
  useUrl: false,
  title: null,
  refreshPageTables: null,
};

export default LocationTable;
