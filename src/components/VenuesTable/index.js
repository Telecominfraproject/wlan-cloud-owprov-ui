import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth, useToast, InventoryTable as Table } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { getItem, setItem } from 'utils/localStorageHelper';
import EditVenueModal from 'components/EditTagModal';

const VenuesTable = ({
  entity,
  toggleAdd,
  refreshId,
  onlyEntity,
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
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  // States needed for Inventory Table
  const [loading, setLoading] = useState(false);
  const [venueCount, setVenueCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [venuesPerPage, setVenuesPerPage] = useState(getItem('venuesPerPage') || '10');
  const [onlyUnassigned, setOnlyUnassigned] = useState(true);
  const [venues, setVenues] = useState([]);

  const toggleUnassignedDisplay = () => setOnlyUnassigned(!onlyUnassigned);
  const toggleEditModal = (venueId) => {
    setSelectedVenueId(venueId);
    setShowEditModal(!showEditModal);
  };

  const getVenueInformation = (selectedPage = page, venuePerPage = venuesPerPage) => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(
        `${endpoints.owprov}/api/v1/venue?${
          onlyEntity && entity !== null ? `&entity=${entity.uuid}&` : ''
        }limit=${venuePerPage}&offset=${venuePerPage * selectedPage + 1}${
          !onlyUnassigned ? 'withExtendedInfo=true&' : '&unassigned=true'
        }`,
        options,
      )
      .then((response) => {
        setVenues(response.data.venues);
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('inventory.error_retrieving'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const getCount = () => {
    setLoading(true);

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .get(
        `${endpoints.owprov}/api/v1/venue?${
          onlyEntity && entity !== null ? `entity=${entity.uuid}&` : ''
        }countOnly=true${!onlyUnassigned ? '' : '&unassigned=true'}`,
        {
          headers,
        },
      )
      .then((response) => {
        const venuesCount = response.data.count;
        const pagesCount = Math.ceil(venuesCount / venuesPerPage);
        setPageCount(pagesCount);
        setVenueCount(venuesCount);

        let selectedPage = page;

        if (page >= pagesCount) {
          if (useUrl) history.push(`${path}?page=${pagesCount - 1}`);
          else setLocalPage(`${pagesCount - 1}`);
          selectedPage = pagesCount - 1;
        }
        if (venuesCount > 0) {
          getVenueInformation(selectedPage);
        } else {
          setVenues([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setVenues([]);
        setLoading(false);
      });
  };

  const updateVenuesPerPage = (value) => {
    setItem('venuesPerPage', value);
    setVenuesPerPage(value);

    const newPageCount = Math.ceil(venueCount / value);
    setPageCount(newPageCount);

    let selectedPage = page;

    if (page >= newPageCount) {
      if (useUrl) history.push(`${path}?page=${newPageCount - 1}`);
      else setLocalPage(`${newPageCount - 1}`);
      selectedPage = newPageCount - 1;
    }

    getVenueInformation(selectedPage, value);
  };

  const updatePage = ({ selected: selectedPage }) => {
    if (useUrl) history.push(`${path}?page=${selectedPage}`);
    else setLocalPage(`${selectedPage}`);

    getVenueInformation(selectedPage);
  };

  const unassignVenue = (serialNumber) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {};

    axiosInstance
      .put(
        `${endpoints.owprov}/api/v1/inventory/${serialNumber}?unassign=true`,
        parameters,
        options,
      )
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('inventory.successful_unassign'),
          color: 'success',
          autohide: true,
        });
        if (refreshPageTables !== null) refreshPageTables();
        getCount();
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('inventory.error_unassign'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteVenue = (serialNumber) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {};

    axiosInstance
      .delete(`${endpoints.owprov}/api/v1/inventory/${serialNumber}`, parameters, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('inventory.successful_venue_delete'),
          color: 'success',
          autohide: true,
        });
        if (refreshPageTables !== null) refreshPageTables();
        getCount();
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('inventory.error_delete_venue'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if ((useUrl && page === undefined) || page === null || Number.isNaN(page)) {
      history.push(`${path}?page=0`);
    }
    if (!useUrl) setLocalPage('0');

    getCount();
  }, [entity]);

  useEffect(() => {
    if ((useUrl && page === undefined) || page === null || Number.isNaN(page)) {
      history.push(`${path}?page=0`);
    }
    if (!useUrl) setLocalPage('0');

    getCount();
  }, []);

  useEffect(() => {
    getCount();
  }, [onlyUnassigned]);

  useEffect(() => {
    if (refreshId > 0) getCount();
  }, [refreshId]);

  return (
    <div>
      <Table
        t={t}
        loading={loading}
        venues={venues}
        venuesPerPage={venuesPerPage}
        updateVenuesPerPage={updateVenuesPerPage}
        page={useUrl ? page : localPage}
        updatePage={updatePage}
        pageCount={pageCount}
        toggleAdd={toggleAdd}
        onlyEntity={onlyEntity}
        unassign={unassignVenue}
        entity={entity}
        title={title}
        toggleEditModal={toggleEditModal}
        deleteVenue={deleteVenue}
        onlyUnassigned={onlyUnassigned}
        toggleUnassignedDisplay={toggleUnassignedDisplay}
      />
      <EditVenueModal
        show={showEditModal}
        toggle={toggleEditModal}
        venueSerialNumber={selectedVenueId}
        refreshTable={refreshPageTables}
      />
    </div>
  );
};

VenuesTable.propTypes = {
  entity: PropTypes.instanceOf(Object),
  toggleAdd: PropTypes.func,
  refreshId: PropTypes.number,
  onlyEntity: PropTypes.bool,
  useUrl: PropTypes.bool,
  title: PropTypes.string,
  refreshPageTables: PropTypes.func,
};

VenuesTable.defaultProps = {
  entity: null,
  toggleAdd: null,
  refreshId: 0,
  onlyEntity: false,
  useUrl: false,
  title: null,
  refreshPageTables: null,
};

export default VenuesTable;
