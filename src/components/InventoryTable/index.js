import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth, useToast, InventoryTable as Table } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { getItem, setItem } from 'utils/localStorageHelper';
import EditTagModal from 'components/EditTagModal';

const InventoryTable = ({
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
  const [selectedTagId, setSelectedTagId] = useState(null);

  // States needed for Inventory Table
  const [loading, setLoading] = useState(false);
  const [tagCount, setTagCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [tagsPerPage, setTagsPerPage] = useState(getItem('tagsPerPage') || '10');
  const [onlyUnassigned, setOnlyUnassigned] = useState(true);
  const [tags, setTags] = useState([]);

  const toggleUnassignedDisplay = () => setOnlyUnassigned(!onlyUnassigned);
  const toggleEditModal = (tagId) => {
    setSelectedTagId(tagId);
    setShowEditModal(!showEditModal);
  };

  const getTagInformation = (selectedPage = page, tagPerPage = tagsPerPage) => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(
        `${endpoints.owprov}/api/v1/inventory?${
          onlyEntity && entity !== null ? `&entity=${entity.uuid}&` : ''
        }limit=${tagPerPage}&offset=${tagPerPage * selectedPage + 1}${
          !onlyUnassigned ? 'withExtendedInfo=true&' : '&unassigned=true'
        }`,
        options,
      )
      .then((response) => {
        setTags(response.data.tags);
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
        `${endpoints.owprov}/api/v1/inventory?${
          onlyEntity && entity !== null ? `entity=${entity.uuid}&` : ''
        }countOnly=true${!onlyUnassigned ? '' : '&unassigned=true'}`,
        {
          headers,
        },
      )
      .then((response) => {
        const tagsCount = response.data.count;
        const pagesCount = Math.ceil(tagsCount / tagsPerPage);
        setPageCount(pagesCount);
        setTagCount(tagsCount);

        let selectedPage = page;

        if (page >= pagesCount) {
          if (useUrl) history.push(`${path}?page=${pagesCount - 1}`);
          else setLocalPage(`${pagesCount - 1}`);
          selectedPage = pagesCount - 1;
        }
        if (tagsCount > 0) {
          getTagInformation(selectedPage);
        } else {
          setTags([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setTags([]);
        setLoading(false);
      });
  };

  const updateTagsPerPage = (value) => {
    setItem('tagsPerPage', value);
    setTagsPerPage(value);

    const newPageCount = Math.ceil(tagCount / value);
    setPageCount(newPageCount);

    let selectedPage = page;

    if (page >= newPageCount) {
      if (useUrl) history.push(`${path}?page=${newPageCount - 1}`);
      else setLocalPage(`${newPageCount - 1}`);
      selectedPage = newPageCount - 1;
    }

    getTagInformation(selectedPage, value);
  };

  const updatePage = ({ selected: selectedPage }) => {
    if (useUrl) history.push(`${path}?page=${selectedPage}`);
    else setLocalPage(`${selectedPage}`);

    getTagInformation(selectedPage);
  };

  const unassignTag = (serialNumber) => {
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

  const assignTag = (serialNumber) => {
    if (entity !== null) {
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        entity: entity.uuid,
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/inventory/${serialNumber}`, parameters, options)
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('inventory.successful_assign'),
            color: 'success',
            autohide: true,
          });
          if (refreshPageTables !== null) refreshPageTables();
          getCount();
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('inventory.assign_error'),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const deleteTag = (serialNumber) => {
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
          body: t('inventory.successful_tag_delete'),
          color: 'success',
          autohide: true,
        });
        if (refreshPageTables !== null) refreshPageTables();
        getCount();
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('inventory.error_delete_tag'),
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
        tags={tags}
        tagsPerPage={tagsPerPage}
        updateTagsPerPage={updateTagsPerPage}
        page={useUrl ? page : localPage}
        updatePage={updatePage}
        pageCount={pageCount}
        toggleAdd={toggleAdd}
        onlyEntity={onlyEntity}
        unassign={unassignTag}
        assignToEntity={assignTag}
        entity={entity}
        title={title}
        toggleEditModal={toggleEditModal}
        deleteTag={deleteTag}
        onlyUnassigned={onlyUnassigned}
        toggleUnassignedDisplay={toggleUnassignedDisplay}
      />
      <EditTagModal
        show={showEditModal}
        toggle={toggleEditModal}
        tagSerialNumber={selectedTagId}
        refreshTable={refreshPageTables}
      />
    </div>
  );
};

InventoryTable.propTypes = {
  entity: PropTypes.instanceOf(Object),
  toggleAdd: PropTypes.func,
  refreshId: PropTypes.number,
  onlyEntity: PropTypes.bool,
  useUrl: PropTypes.bool,
  title: PropTypes.string,
  refreshPageTables: PropTypes.func,
};

InventoryTable.defaultProps = {
  entity: null,
  toggleAdd: null,
  refreshId: 0,
  onlyEntity: false,
  useUrl: false,
  title: null,
  refreshPageTables: null,
};

export default InventoryTable;