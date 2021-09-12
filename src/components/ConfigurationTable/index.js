import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CSelect,
  CButtonToolbar,
  CButton,
  CPopover,
} from '@coreui/react';
import { cilPlus, cilSync } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useAuth, useToast, ConfigurationTable as Table } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { getItem, setItem } from 'utils/localStorageHelper';

const ConfigurationTable = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentToken, endpoints } = useAuth();
  const history = useHistory();
  const path = history.location.pathname.split('?')[0];
  const { search } = useLocation();
  const page = new URLSearchParams(search).get('page');
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [configCount, setConfigCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [configsPerPage, setConfigsPerPage] = useState(getItem('configPerPage') || '10');

  const getDetailedInformation = (selectedPage = page, configPerPage = configsPerPage) => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      params: {
        limit: configPerPage,
        offset: configPerPage * selectedPage + 1,
      },
    };
    axiosInstance
      .get(`${endpoints.owprov}/api/v1/configurations`, options)
      .then((response) => {
        setConfigs(response.data.configurations);
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

    const params = {
      countOnly: true,
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/configurations`, {
        headers,
        params,
      })
      .then((response) => {
        const configsCount = response.data.count;
        const pagesCount = Math.ceil(configsCount / configsPerPage);
        setPageCount(pagesCount);
        setConfigCount(configsCount);

        let selectedPage = page;

        if (page >= pagesCount) {
          history.push(`${path}?page=${pagesCount - 1}`);
          selectedPage = pagesCount - 1;
        }
        if (configsCount > 0) {
          getDetailedInformation(selectedPage);
        } else {
          setConfigs([]);
        }
      })
      .catch(() => {
        setConfigs([]);
      })
      .finally(() => setLoading(false));
  };

  const updateConfigPerPage = (value) => {
    setItem('configPerPage', value);
    setConfigsPerPage(value);

    const newPageCount = Math.ceil(configCount / value);
    setPageCount(newPageCount);

    let selectedPage = page;

    if (page >= newPageCount) {
      history.push(`${path}?page=${newPageCount - 1}`);
      selectedPage = newPageCount - 1;
    }

    getDetailedInformation(selectedPage, value);
  };

  const updatePage = ({ selected: selectedPage }) => {
    history.push(`${path}?page=${selectedPage}`);
    getDetailedInformation(selectedPage);
  };

  const refresh = () => getCount();

  useEffect(() => {
    if (page === undefined || page === null || Number.isNaN(page)) {
      history.push(`${path}?page=0`);
    }
    getCount();
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
          {t('configuration.configurations')}
        </div>
        <div className="pl-3 float-right">
          <CButtonToolbar role="group" className="justify-content-end">
            <CPopover content={t('configuration.create_config')}>
              <CButton color="primary" variant="outline" className="mx-1">
                <CIcon content={cilPlus} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.refresh')}>
              <CButton color="primary" variant="outline" onClick={refresh} className="ml-1">
                <CIcon content={cilSync} />
              </CButton>
            </CPopover>
          </CButtonToolbar>
        </div>
      </CCardHeader>
      <CCardBody>
        <Table t={t} history={history} loading={loading} configs={configs} />
        <div className="pl-3">
          <div style={{ float: 'left' }} className="pr-3">
            <ReactPaginate
              previousLabel="← Previous"
              nextLabel="Next →"
              pageCount={pageCount}
              onPageChange={updatePage}
              forcePage={Number(page)}
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
          <p style={{ float: 'left' }} className="pr-2 pt-1">
            {t('common.items_per_page')}
          </p>
          <div style={{ width: '100px', float: 'left' }} className="px-2">
            <CSelect
              custom
              defaultValue={configsPerPage}
              onChange={(e) => updateConfigPerPage(e.target.value)}
              disabled={loading}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </CSelect>
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default ConfigurationTable;
