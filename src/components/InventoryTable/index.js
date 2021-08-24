import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth, useToast, InventoryTable as Table } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { getItem, setItem } from 'utils/localStorageHelper';

const InventoryTable = ({ entity, toggleAdd, refreshId }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentToken, endpoints } = useAuth();
  const history = useHistory();
  const path = history.location.pathname.split('?')[0];
  const { search } = useLocation();
  const page = new URLSearchParams(search).get('page');

  // States needed for Inventory Table
  const [loading, setLoading] = useState(false);
  const [tagCount, setTagCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [tagsPerPage, setTagsPerPage] = useState(getItem('tagsPerPage') || '10');
  const [tags, setTags] = useState([]);

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
          entity !== null ? `entity=${entity.uuid}&` : ''
        }limit=${tagPerPage}&offset=${
          tagPerPage * selectedPage + 1 === 1 ? 0 : tagPerPage * selectedPage + 1
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
          entity !== null ? `entity=${entity.uuid}&` : ''
        }countOnly=true`,
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
          history.push(`${path}?page=${pagesCount - 1}`);
          selectedPage = pagesCount - 1;
        }
        if (tagsCount > 0) {
          getTagInformation(selectedPage);
        }
        setLoading(false);
      })
      .catch(() => {
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
      history.push(`${path}?page=${newPageCount - 1}`);
      selectedPage = newPageCount - 1;
    }

    getTagInformation(selectedPage, value);
  };

  const updatePage = ({ selected: selectedPage }) => {
    history.push(`${path}?page=${selectedPage}`);

    getTagInformation(selectedPage);
  };

  useEffect(() => {
    if (page === undefined || page === null || Number.isNaN(page)) {
      history.push(`${path}?page=0`);
    }
    getCount();
  }, [entity]);

  useEffect(() => {
    if (page === undefined || page === null || Number.isNaN(page)) {
      history.push(`${path}?page=0`);
    }
    getCount();
  }, []);

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
        page={page}
        updatePage={updatePage}
        pageCount={pageCount}
        toggleAdd={toggleAdd}
      />
    </div>
  );
};

InventoryTable.propTypes = {
  entity: PropTypes.instanceOf(Object),
  toggleAdd: PropTypes.func,
  refreshId: PropTypes.number,
};

InventoryTable.defaultProps = {
  entity: null,
  toggleAdd: null,
  refreshId: 0,
};

export default InventoryTable;
