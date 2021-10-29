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
import { useAuth, useToast, ContactTable as Table } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { getItem, setItem } from 'utils/localStorageHelper';
import EditContactModal from 'components/EditContactModal';

const ContactsTable = ({
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
  const [selectedContactId, setSelectedContactId] = useState(null);
  // States needed for Inventory Table
  const [loading, setLoading] = useState(false);
  const [contactCount, setContactCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [contactsPerPage, setContactsPerPage] = useState(getItem('contactsPerPage') || '10');
  const [contacts, setContacts] = useState([]);
  const [entityContactsArray, setEntityContactsArray] = useState([]);

  const toggleEditModal = (contactId) => {
    setSelectedContactId(contactId);
    setShowEditModal(!showEditModal);
  };

  const getContactInformation = (selectedPage = page, contactPerPage = contactsPerPage) => {
    setLoading(true);

    let params = {};

    if (filterOnEntity) {
      params = {
        select: entity.extraData.contacts
          .slice(contactPerPage * selectedPage, contactPerPage)
          .join(','),
        withExtendedInfo: true,
      };
    } else {
      params = {
        withExtendedInfo: true,
        limit: contactPerPage,
        offset: contactPerPage * selectedPage + 1,
      };
    }

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      params,
    };

    let newContacts = [];

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/contact`, options)
      .then((response) => {
        newContacts = response.data.contacts;
        setContacts(newContacts);
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('contact.error_fetching_list'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const getCount = () => {
    setLoading(true);

    if (filterOnEntity) {
      if (entity.extraData?.contacts) {
        const contactsCount = entity.extraData.contacts.length;
        const pagesCount = Math.ceil(contactsCount / contactsPerPage);
        setPageCount(pagesCount);
        setContactCount(contactsCount);

        let selectedPage = page;

        if (page >= pagesCount) {
          if (useUrl) history.push(`${path}?page=${pagesCount - 1}`);
          else setLocalPage(`${pagesCount - 1}`);
          selectedPage = pagesCount - 1;
        }
        if (contactsCount > 0) {
          getContactInformation(selectedPage);
        } else {
          setContacts([]);
          setLoading(false);
        }
      } else {
        setContacts([]);
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
        .get(`${endpoints.owprov}/api/v1/contact`, {
          headers,
          params,
        })
        .then((response) => {
          const contactsCount = response.data.count;
          const pagesCount = Math.ceil(contactsCount / contactsPerPage);
          setPageCount(pagesCount);
          setContactCount(contactsCount);

          let selectedPage = page;

          if (page >= pagesCount) {
            if (useUrl) history.push(`${path}?page=${pagesCount - 1}`);
            else setLocalPage(`${pagesCount - 1}`);
            selectedPage = pagesCount - 1;
          }
          if (contactsCount > 0) {
            getContactInformation(selectedPage);
          } else {
            setContacts([]);
            setLoading(false);
          }
        })
        .catch(() => {
          setContacts([]);
          setLoading(false);
        });
    }
  };

  const updateContactsPerPage = (value) => {
    setItem('contactsPerPage', value);
    setContactsPerPage(value);

    const newPageCount = Math.ceil(contactCount / value);
    setPageCount(newPageCount);

    let selectedPage = page;

    if (page >= newPageCount) {
      if (useUrl) history.push(`${path}?page=${newPageCount - 1}`);
      else setLocalPage(`${newPageCount - 1}`);
      selectedPage = newPageCount - 1;
    }

    getContactInformation(selectedPage, value);
  };

  const updatePage = ({ selected: selectedPage }) => {
    if (useUrl) history.push(`${path}?page=${selectedPage}`);
    else setLocalPage(`${selectedPage}`);

    getContactInformation(selectedPage);
  };

  const unassignContact = (serialNumber) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {};

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/contact/${serialNumber}?unassign=true`, parameters, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('contact.successful_unassign'),
          color: 'success',
          autohide: true,
        });
        if (refreshPageTables !== null) refreshPageTables();
        else getCount();
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('contact.error_unassign'),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const assignContact = (id) => {
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
        .put(`${endpoints.owprov}/api/v1/contact/${id}`, parameters, options)
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('contact.successful_assign'),
            color: 'success',
            autohide: true,
          });
          if (refreshPageTables !== null) refreshPageTables();
          else getCount();
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('contact.error_assign', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const deleteContact = (id) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .delete(`${endpoints.owprov}/api/v1/contact/${id}`, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('contact.successful_delete'),
          color: 'success',
          autohide: true,
        });
        if (refreshPageTables !== null) refreshPageTables();
        else getCount();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('contact.error_delete', { error: e.response?.data?.ErrorDescription }),
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

    if (entity === null) setEntityContactsArray([]);
    else {
      const newContacts =
        entity?.extraData?.contacts !== undefined ? entity.extraData?.contacts?.map((d) => d) : [];
      if (newContacts.join(',') !== entityContactsArray.join(','))
        setEntityContactsArray(newContacts);
    }
  }, [entity]);

  useEffect(() => {
    getCount();
  }, [entityContactsArray]);

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
              <CPopover content={t('contact.create_contact')}>
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
            contacts={contacts}
            unassign={unassignContact}
            assignToEntity={assignContact}
            toggleEditModal={toggleEditModal}
            deleteContact={deleteContact}
            perPageSwitcher={
              <div style={{ width: '100px' }} className="float-left px-2">
                <CSelect
                  custom
                  defaultValue={contactsPerPage}
                  onChange={(e) => updateContactsPerPage(e.target.value)}
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
      <EditContactModal
        show={showEditModal}
        toggle={toggleEditModal}
        editEntity={entity !== null}
        contactId={selectedContactId}
        refreshTable={getCount}
      />
    </div>
  );
};

ContactsTable.propTypes = {
  entity: PropTypes.instanceOf(Object),
  toggleAdd: PropTypes.func,
  refreshId: PropTypes.number,
  filterOnEntity: PropTypes.bool,
  useUrl: PropTypes.bool,
  title: PropTypes.string,
  refreshPageTables: PropTypes.func,
};

ContactsTable.defaultProps = {
  entity: null,
  toggleAdd: null,
  refreshId: 0,
  filterOnEntity: false,
  useUrl: false,
  title: null,
  refreshPageTables: null,
};

export default ContactsTable;
