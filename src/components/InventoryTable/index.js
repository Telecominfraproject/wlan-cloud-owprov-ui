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
  CSwitch,
  CButtonToolbar,
} from '@coreui/react';
import { cilCloudUpload, cilPlus, cilSync, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useAuth, useToast, InventoryTable as Table } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { getItem, setItem } from 'utils/localStorageHelper';
import EditTagModal from 'components/EditTagModal';
import ImportDevicesModal from 'components/ImportDevicesModal';
import DeleteDevicesModal from 'components/DeleteDevicesModal';
import AssociateConfigurationModal from 'components/AssociateConfigurationModal';

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
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [showAssoc, setShowAssoc] = useState(false);
  const [assocInfo, setAssocInfo] = useState({ deviceConfiguration: '' });

  const toggleAssoc = (info) => {
    if (info) setAssocInfo(info);
    else setAssocInfo({ deviceConfiguration: '' });
    setShowAssoc(!showAssoc);
  };

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

  const toggleImportModal = () => {
    setShowImportModal(!showImportModal);
  };

  const toggleBulkDeleteModal = () => {
    setShowBulkDeleteModal(!showBulkDeleteModal);
  };

  const getTagInformation = (selectedPage = page, tagPerPage = tagsPerPage) => {
    setLoading(true);

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      params: {
        entity: onlyEntity && entity !== null && !entity.isVenue ? entity.uuid : undefined,
        venue: onlyEntity && entity !== null && entity.isVenue ? entity.uuid : undefined,
        unassigned: onlyUnassigned ? true : undefined,
        withExtendedInfo: !onlyUnassigned ? true : undefined,
        limit: tagPerPage,
        offset: tagPerPage * selectedPage + 1,
      },
    };

    const deviceConfigs = {};
    let newTags = [];

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/inventory`, options)
      .then((response) => {
        newTags = response.data.taglist;

        for (let i = 0; i < newTags.length; i += 1) {
          const tag = newTags[i];
          if (tag.deviceConfiguration !== '') deviceConfigs[tag.deviceConfiguration] = true;
        }

        if (Object.keys(deviceConfigs).length === 0) {
          const tagsWithConf = newTags.map((tag) => ({
            ...tag,
            deviceConfigurationName: '',
          }));
          setTags(tagsWithConf);
          return null;
        }
        const configIds = Object.keys(deviceConfigs).join(',');
        return axiosInstance.get(`${endpoints.owprov}/api/v1/configurations?select=${configIds}`, {
          headers: options.headers,
        });
      })
      .then((response) => {
        if (response) {
          for (let i = 0; i < response.data.configurations.length; i += 1) {
            const conf = response.data.configurations[i];
            deviceConfigs[conf.id] = conf.name;
          }
          const tagsWithConf = newTags.map((tag) => ({
            ...tag,
            deviceConfigurationName: deviceConfigs[tag.deviceConfiguration] ?? '',
          }));
          setTags(tagsWithConf);
        }
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
      entity: onlyEntity && entity !== null && !entity.isVenue ? entity.uuid : undefined,
      venue: onlyEntity && entity !== null && entity.isVenue ? entity.uuid : undefined,
      countOnly: true,
      unassigned: onlyUnassigned && !onlyEntity ? true : undefined,
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
          if (useUrl) history.push(`${path}?page=${pagesCount - 1}`);
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

  const refresh = () => getCount();

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

        refresh();

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
      <CCard>
        <CCardHeader className="p-1">
          <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
            {title}
          </div>
          <div className="pl-3 float-right">
            <CButtonToolbar role="group" className="justify-content-end">
              <CPopover content={t('inventory.add_tag')}>
                <CButton color="primary" variant="outline" onClick={toggleAdd} className="mx-1">
                  <CIcon content={cilPlus} />
                </CButton>
              </CPopover>
              <CPopover content={t('inventory.import_devices')}>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={toggleImportModal}
                  className="mx-1"
                >
                  <CIcon content={cilCloudUpload} />
                </CButton>
              </CPopover>
              <CPopover content={t('inventory.bulk_delete_devices')}>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={toggleBulkDeleteModal}
                  className="mx-1"
                >
                  <CIcon content={cilTrash} />
                </CButton>
              </CPopover>
              <CPopover content={t('common.refresh')}>
                <CButton color="primary" variant="outline" onClick={refresh} className="ml-1">
                  <CIcon content={cilSync} />
                </CButton>
              </CPopover>
            </CButtonToolbar>
          </div>
          <div className="pt-1 text-center float-right">
            <div hidden={onlyEntity || entity !== null}>
              <CSwitch
                id="showUnassigned"
                color="primary"
                defaultChecked={onlyUnassigned}
                onClick={toggleUnassignedDisplay}
                size="lg"
              />
            </div>
          </div>
          <div className="pt-2 text-right px-2 float-right">
            <div hidden={onlyEntity || entity !== null}>{t('entity.only_unassigned')}</div>
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
            onlyEntity={onlyEntity}
            unassign={unassignTag}
            assignToEntity={assignTag}
            toggleEditModal={toggleEditModal}
            deleteTag={deleteTag}
            onlyUnassigned={onlyUnassigned}
            toggleAssociate={toggleAssoc}
          />
        </CCardBody>
      </CCard>
      <EditTagModal
        show={showEditModal}
        toggle={toggleEditModal}
        editEntity={entity !== null}
        tagSerialNumber={selectedTagId}
        refreshTable={refreshPageTables}
      />
      <ImportDevicesModal
        entity={entity}
        show={showImportModal}
        toggle={toggleImportModal}
        refreshPageTables={refreshPageTables}
      />
      <DeleteDevicesModal
        entity={entity}
        show={showBulkDeleteModal}
        toggle={toggleBulkDeleteModal}
        refreshPageTables={refreshPageTables}
      />
      <AssociateConfigurationModal
        show={showAssoc}
        toggle={toggleAssoc}
        defaultConfig={assocInfo}
        updateConfiguration={updateConfiguration}
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
