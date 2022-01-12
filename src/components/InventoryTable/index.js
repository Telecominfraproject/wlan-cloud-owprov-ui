import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {
  CButton,
  CCardBody,
  CCard,
  CCardHeader,
  CPopover,
  CButtonToolbar,
  CTabPane,
  CTabContent,
  CNav,
  CNavLink,
} from '@coreui/react';
import { cilCloudUpload, cilPlus, cilSync, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useAuth, useToast, useToggle } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { getItem, setItem } from 'utils/localStorageHelper';
import EditTagModal from 'components/EditTagModal';
import ImportDevicesModal from 'components/ImportDevicesModal';
import DeleteDevicesModal from 'components/DeleteDevicesModal';
import AssociateVenueEntityModal from 'components/AssociateVenueEntityModal';
import ComputerConfigModal from 'components/ComputedConfigModal';
import ConfigurationPushResultModal from 'components/ConfigurationPushResultModal';
import AssociatedSingleConfigModal from 'components/AssociatedSingleConfigModal';
import DeviceSearchBar from 'components/DeviceSearchBar';
import Table from './Table';

const InventoryTable = ({
  entity,
  toggleAdd,
  filterOnEntity,
  useUrl,
  title,
  refreshTable,
  refreshId,
  onlyUnassigned,
  hideTopBar,
  hideSearch,
  twoTables,
  claimedSerials,
  claim,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentToken, endpoints } = useAuth();
  const history = useHistory();
  const path = history.location.pathname.split('?')[0];
  const { search } = useLocation();
  const page = new URLSearchParams(search).get(onlyUnassigned ? 'unassignedPage' : 'page');
  const [localPage, setLocalPage] = useState('0');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [showAssoc, setShowAssoc] = useState(false);
  const [showAssocEntity, setShowAssocEntity] = useState(false);
  const [showComputed, setShowComputed] = useState(false);
  const [showPush, togglePush] = useToggle(false);
  const [assocInfo, setAssocInfo] = useState({ deviceConfiguration: '' });
  const [pushResult, setPushResult] = useState(null);
  const [pushLoading, setPushLoading] = useState(false);
  const [entityDevicesArray, setEntityDevicesArray] = useState([]);
  const [index, setIndex] = useState(0);

  const toggleAssoc = (info) => {
    if (info) setAssocInfo(info);
    else setAssocInfo({ deviceConfiguration: '' });
    setShowAssoc(!showAssoc);
  };

  const toggleAssocEntity = (info) => {
    if (info) setAssocInfo(info);
    else setAssocInfo({ deviceConfiguration: '' });
    setShowAssocEntity(!showAssocEntity);
  };

  // States needed for Inventory Table
  const [loading, setLoading] = useState(false);
  const [tagCount, setTagCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [tagsPerPage, setTagsPerPage] = useState(getItem('tagsPerPage') || '10');
  const [tags, setTags] = useState([]);

  const toggleEditModal = (tagId) => {
    setSelectedTagId(tagId);
    setShowEditModal(!showEditModal);
  };

  const toggleComputed = (tagId) => {
    setSelectedTagId(tagId);
    setShowComputed(!showComputed);
  };

  const toggleImportModal = () => {
    setShowImportModal(!showImportModal);
  };

  const toggleBulkDeleteModal = () => {
    setShowBulkDeleteModal(!showBulkDeleteModal);
  };

  const getTagInformation = (selectedPage = page, tagPerPage = tagsPerPage) => {
    setLoading(true);

    let params = {};

    if (filterOnEntity) {
      params = {
        select: entity.extraData.devices.slice(tagPerPage * selectedPage, tagPerPage).join(','),
        withExtendedInfo: true,
      };
    } else {
      params = {
        withExtendedInfo: true,
        limit: tagPerPage,
        offset: tagPerPage * selectedPage,
        unassigned: onlyUnassigned ? true : undefined,
      };
    }

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      params,
    };

    let newTags = [];

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/inventory`, options)
      .then((response) => {
        newTags = response.data.taglist;
        setTags(newTags);
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

    if (filterOnEntity) {
      if (entity.extraData?.devices) {
        const deviceCount = entity.extraData.devices.length;
        const pagesCount = Math.ceil(deviceCount / tagsPerPage);
        setPageCount(pagesCount);
        setTagCount(deviceCount);

        let selectedPage = page;

        if (page >= pagesCount) {
          if (useUrl)
            history.push(`${path}?${onlyUnassigned ? 'unassignedPage' : 'page'}=${pagesCount - 1}`);
          else setLocalPage(`${pagesCount - 1}`);
          selectedPage = pagesCount - 1;
        }
        if (deviceCount > 0) {
          getTagInformation(selectedPage);
        } else {
          setTags([]);
          setLoading(false);
        }
      } else {
        setTags([]);
        setLoading(false);
      }
    } else {
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      };

      const params = {
        countOnly: true,
        unassigned: onlyUnassigned ? true : undefined,
      };

      axiosInstance
        .get(`${endpoints.owprov}/api/v1/inventory`, {
          headers,
          params,
        })
        .then((response) => {
          const tagsCount = response.data.count;
          const pagesCount = Math.ceil(tagsCount / tagsPerPage);
          setPageCount(pagesCount);
          setTagCount(tagsCount);

          let selectedPage = page;

          if (page >= pagesCount) {
            if (useUrl)
              history.push(
                `${path}?${onlyUnassigned ? 'unassignedPage' : 'page'}=${pagesCount - 1}`,
              );
            else setLocalPage(`${pagesCount - 1}`);
            selectedPage = pagesCount - 1;
          }
          if (tagsCount > 0) {
            getTagInformation(selectedPage);
          } else {
            setTags([]);
            setLoading(false);
          }
        })
        .catch(() => {
          setTags([]);
          setLoading(false);
        });
    }
  };

  const updateTagsPerPage = (value) => {
    setItem('tagsPerPage', value);
    setTagsPerPage(value);

    const newPageCount = Math.ceil(tagCount / value);
    setPageCount(newPageCount);

    let selectedPage = page;

    if (page >= newPageCount) {
      if (useUrl)
        history.push(`${path}?${onlyUnassigned ? 'unassignedPage' : 'page'}=${newPageCount - 1}`);
      else setLocalPage(`${newPageCount - 1}`);
      selectedPage = newPageCount - 1;
    }

    getTagInformation(selectedPage, value);
  };

  const updatePage = ({ selected: selectedPage }) => {
    if (useUrl)
      history.push(`${path}?${onlyUnassigned ? 'unassignedPage' : 'page'}=${selectedPage}`);
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
        if (refreshTable !== null) refreshTable();
        else getCount();
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
        entity: entity.isVenue ? undefined : entity.uuid,
        venue: entity.isVenue ? entity.uuid : undefined,
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
          if (refreshTable !== null) refreshTable();
          else getCount();
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

    axiosInstance
      .delete(`${endpoints.owprov}/api/v1/inventory/${serialNumber}`, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('inventory.successful_tag_delete'),
          color: 'success',
          autohide: true,
        });
        if (refreshTable !== null) refreshTable();
        else getCount();
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

  const refresh = () => {
    getCount();
    if (refreshTable !== null) refreshTable();
  };

  const updateConfiguration = (v) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {
      deviceConfiguration: v.uuid,
    };

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/inventory/${assocInfo.serialNumber}`, parameters, options)
      .then(() => {
        toggleAssoc();

        getCount();

        addToast({
          title: t('common.success'),
          body: t('common.saved'),
          color: 'success',
          autohide: true,
        });
      })
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('inventory.tag_update_error'),
          color: 'danger',
          autohide: true,
        });
      });
  };

  const assignFromMenu = (v) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const parameters = {
      entity: v.type === 'entity' ? v.uuid : undefined,
      venue: v.type === 'venue' ? v.uuid : undefined,
    };

    axiosInstance
      .put(`${endpoints.owprov}/api/v1/inventory/${assocInfo.serialNumber}`, parameters, options)
      .then(() => {
        toggleAssocEntity();
        addToast({
          title: t('common.success'),
          body: t('inventory.successful_assign'),
          color: 'success',
          autohide: true,
        });
        if (refreshTable !== null) refreshTable();
        else getCount();
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
  };

  const pushConfig = (serialNumber) => {
    togglePush();
    setPushLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/inventory/${serialNumber}?applyConfiguration=true`, options)
      .then((response) => {
        if (response.data.code === 0) {
          togglePush();
          addToast({
            title: t('common.success'),
            body: t('inventory.configuration_successfully_pushed'),
            color: 'success',
            autohide: true,
          });
        } else {
          setPushResult(response.data);
        }
      })
      .catch((e) => {
        togglePush();
        addToast({
          title: t('common.error'),
          body: t('inventory.error_pushing_config', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      })
      .finally(() => setPushLoading(false));
  };

  useEffect(() => {
    if (useUrl && (page === undefined || page === null || Number.isNaN(page))) {
      history.push(`${path}?${onlyUnassigned ? 'unassignedPage' : 'page'}=0`);
    }
    if (!useUrl) setLocalPage('0');

    if (entity === null) setEntityDevicesArray([]);
    else {
      const newDevices =
        entity?.extraData?.devices !== undefined ? entity.extraData?.devices?.map((d) => d) : [];
      if (newDevices.join(',') !== entityDevicesArray.join(',')) setEntityDevicesArray(newDevices);
    }
  }, [entity]);

  useEffect(() => {
    getCount();
  }, [entityDevicesArray]);

  useEffect(() => {
    if (refreshId > 0) getCount();
  }, [refreshId]);

  useEffect(() => {
    if (useUrl && (page === undefined || page === null || Number.isNaN(page))) {
      history.push(`${path}?${onlyUnassigned ? 'unassignedPage' : 'page'}=0`);
    }
    if (!useUrl) setLocalPage('0');
    getCount();
  }, []);

  useEffect(() => {
    getCount();
  }, [onlyUnassigned]);

  if (twoTables) {
    return (
      <div>
        <CCard className="my-0 py-0">
          <CCardHeader className={hideTopBar ? 'p-1' : 'dark-header'}>
            {hideTopBar ? null : (
              <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
                {title}
              </div>
            )}
            <div className="pl-3 float-right">
              <CButtonToolbar role="group" className="justify-content-end">
                <CPopover content={t('inventory.add_tag')}>
                  <CButton color="info" onClick={toggleAdd}>
                    <CIcon content={cilPlus} />
                  </CButton>
                </CPopover>
                <CPopover content={t('inventory.import_devices')}>
                  <CButton
                    hidden={entity === null}
                    color="info"
                    onClick={toggleImportModal}
                    className="ml-2"
                  >
                    <CIcon content={cilCloudUpload} />
                  </CButton>
                </CPopover>
                <CPopover content={t('inventory.bulk_delete_devices')}>
                  <CButton color="danger" onClick={toggleBulkDeleteModal} className="ml-2">
                    <CIcon content={cilTrash} />
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
          <CNav variant="tabs" className="mb-0 p-0">
            <CNavLink
              className="font-weight-bold"
              href="#"
              active={index === 0}
              onClick={() => setIndex(0)}
            >
              {t('entity.only_unassigned')}
            </CNavLink>
            <CNavLink
              className="font-weight-bold"
              href="#"
              active={index === 1}
              onClick={() => setIndex(1)}
            >
              {t('common.show_all')}
            </CNavLink>
          </CNav>
          <CTabContent>
            <CTabPane active={index === 0}>
              {index === 0 ? (
                <div>
                  <CCardHeader className="p-0">
                    <div style={{ width: '400px' }}>
                      <DeviceSearchBar toggleEditModal={toggleEditModal} />
                    </div>
                  </CCardHeader>
                  <CCardBody className="p-0">
                    <Table
                      t={t}
                      loading={loading}
                      entity={entity}
                      tags={tags}
                      tagsPerPage={tagsPerPage}
                      updateTagsPerPage={updateTagsPerPage}
                      page={useUrl ? page : localPage}
                      updatePage={updatePage}
                      pageCount={pageCount}
                      onlyEntity={filterOnEntity}
                      unassign={unassignTag}
                      assignToEntity={assignTag}
                      toggleEditModal={toggleEditModal}
                      deleteTag={deleteTag}
                      onlyUnassigned={onlyUnassigned}
                      toggleAssociate={toggleAssoc}
                      toggleAssocEntity={toggleAssocEntity}
                      toggleComputed={toggleComputed}
                      pushConfig={pushConfig}
                    />
                  </CCardBody>
                </div>
              ) : null}
            </CTabPane>
            <CTabPane active={index === 1}>
              {index === 1 ? (
                <InventoryTable
                  title={t('inventory.title')}
                  entityPage={false}
                  refreshId={refreshId}
                  useUrl={useUrl}
                  refreshPageTables={refreshTable}
                  hideTopBar
                />
              ) : null}
            </CTabPane>
          </CTabContent>
        </CCard>
        <EditTagModal
          show={showEditModal}
          toggle={toggleEditModal}
          editEntity={entity !== null}
          tagSerialNumber={selectedTagId}
          refreshTable={getCount}
          pushConfig={pushConfig}
        />
        {entity === null ? null : (
          <ImportDevicesModal
            entity={entity}
            show={showImportModal}
            toggle={toggleImportModal}
            refreshPageTables={refreshTable}
          />
        )}
        <DeleteDevicesModal
          entity={entity}
          show={showBulkDeleteModal}
          toggle={toggleBulkDeleteModal}
          refreshPageTables={refreshTable}
        />
        <AssociatedSingleConfigModal
          show={showAssoc}
          toggle={toggleAssoc}
          defaultConfig={assocInfo}
          updateConfiguration={updateConfiguration}
        />
        <AssociateVenueEntityModal
          show={showAssocEntity}
          toggle={toggleAssocEntity}
          updateConfiguration={assignFromMenu}
        />
        <ComputerConfigModal
          show={showComputed}
          toggle={toggleComputed}
          pushConfig={pushConfig}
          serialNumber={selectedTagId}
        />
        <ConfigurationPushResultModal
          show={showPush}
          toggle={togglePush}
          result={pushResult}
          loading={pushLoading}
        />
      </div>
    );
  }
  return (
    <div>
      <CCard className="my-0 py-0">
        {hideTopBar ? null : (
          <CCardHeader className={hideTopBar ? 'p-1' : 'dark-header'}>
            <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
              {title}
            </div>
            <div className="pl-3 float-right">
              <CButtonToolbar role="group" className="justify-content-end">
                <CPopover content={t('inventory.add_tag')}>
                  <CButton color="info" onClick={toggleAdd}>
                    <CIcon content={cilPlus} />
                  </CButton>
                </CPopover>
                <CPopover content={t('inventory.import_devices')}>
                  <CButton
                    hidden={entity === null}
                    color="info"
                    onClick={toggleImportModal}
                    className="ml-2"
                  >
                    <CIcon content={cilCloudUpload} />
                  </CButton>
                </CPopover>
                <CPopover content={t('inventory.bulk_delete_devices')}>
                  <CButton color="danger" onClick={toggleBulkDeleteModal} className="ml-2">
                    <CIcon content={cilTrash} />
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
        )}
        {!hideSearch && (
          <CCardHeader className="p-0">
            <div style={{ width: '400px' }}>
              <DeviceSearchBar toggleEditModal={toggleEditModal} />
            </div>
          </CCardHeader>
        )}
        <CCardBody className="p-0">
          <Table
            t={t}
            loading={loading}
            entity={entity}
            tags={tags}
            tagsPerPage={tagsPerPage}
            updateTagsPerPage={updateTagsPerPage}
            page={useUrl ? page : localPage}
            updatePage={updatePage}
            pageCount={pageCount}
            onlyEntity={filterOnEntity}
            unassign={unassignTag}
            assignToEntity={assignTag}
            toggleEditModal={toggleEditModal}
            deleteTag={deleteTag}
            onlyUnassigned={onlyUnassigned}
            toggleAssociate={toggleAssoc}
            toggleAssocEntity={toggleAssocEntity}
            toggleComputed={toggleComputed}
            pushConfig={pushConfig}
            claim={claim}
            claimedSerials={claimedSerials}
          />
        </CCardBody>
      </CCard>
      <EditTagModal
        show={showEditModal}
        toggle={toggleEditModal}
        editEntity={entity !== null}
        tagSerialNumber={selectedTagId}
        refreshTable={refreshTable ?? getCount}
        pushConfig={pushConfig}
      />
      {entity === null ? null : (
        <ImportDevicesModal
          entity={entity}
          show={showImportModal}
          toggle={toggleImportModal}
          refreshPageTables={refreshTable}
        />
      )}
      <DeleteDevicesModal
        entity={entity}
        show={showBulkDeleteModal}
        toggle={toggleBulkDeleteModal}
        refreshPageTables={refreshTable}
      />
      <AssociatedSingleConfigModal
        show={showAssoc}
        toggle={toggleAssoc}
        defaultConfig={assocInfo}
        updateConfiguration={updateConfiguration}
      />
      <AssociateVenueEntityModal
        show={showAssocEntity}
        toggle={toggleAssocEntity}
        updateConfiguration={assignFromMenu}
      />
      <ComputerConfigModal
        show={showComputed}
        toggle={toggleComputed}
        pushConfig={pushConfig}
        serialNumber={selectedTagId}
      />
      <ConfigurationPushResultModal
        show={showPush}
        toggle={togglePush}
        result={pushResult}
        loading={pushLoading}
      />
    </div>
  );
};

InventoryTable.propTypes = {
  entity: PropTypes.instanceOf(Object),
  toggleAdd: PropTypes.func,
  filterOnEntity: PropTypes.bool,
  useUrl: PropTypes.bool,
  title: PropTypes.string,
  refreshTable: PropTypes.func,
  refreshId: PropTypes.number,
  onlyUnassigned: PropTypes.bool,
  hideTopBar: PropTypes.bool,
  hideSearch: PropTypes.bool,
  claimedSerials: PropTypes.instanceOf(Array),
  claim: PropTypes.func,
  twoTables: PropTypes.bool,
};

InventoryTable.defaultProps = {
  entity: null,
  toggleAdd: null,
  filterOnEntity: false,
  useUrl: false,
  title: null,
  refreshTable: null,
  refreshId: 0,
  onlyUnassigned: false,
  hideTopBar: false,
  hideSearch: false,
  claimedSerials: [],
  claim: null,
  twoTables: false,
};

export default InventoryTable;
