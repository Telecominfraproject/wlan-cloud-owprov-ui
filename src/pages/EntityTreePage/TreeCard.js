import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CPopover,
  CRow,
  CCol,
  CInput,
  CInvalidFeedback,
  CLabel,
  CAlert,
  CCard,
  CCardHeader,
  CCardBody,
  CButtonToolbar,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilAlignCenter,
  cilPencil,
  cilPlus,
  cilSave,
  cilSync,
  cilTrash,
  cilX,
} from '@coreui/icons';
import { useHistory } from 'react-router-dom';
import { useAuth, useToast, useToggle, EntityTree } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useZoomPanHelper } from 'react-flow-renderer';
import Select from 'react-select';
import createLayoutedElements from './dagreAdapter';
import parseNewData from './treeHelper';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const defaultTreeInfo = {
  name: 'Auto-Map',
  description: '',
  visibility: 'public',
  id: '',
  creator: '',
};

const TreeCard = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { endpoints, currentToken, updatePreferences, user } = useAuth();
  const { addToast } = useToast();
  const [tree, setTree] = useState(null);
  const [treeInfo, setTreeInfo] = useState(defaultTreeInfo);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [othersMaps, setOthersMaps] = useState([]);
  const [myMaps, setMyMaps] = useState([]);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [, toggleDuplicateModal] = useToggle(false);

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const toggleDelete = () => {
    setDeleting(!deleting);
  };

  const { transform } = useZoomPanHelper();

  const addDeviceData = async (entities) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const entitiesToFetch = entities.filter((ent) => ent.id.split('/')[0] !== 'edge');

    const entityInfo = await Promise.all(
      entitiesToFetch.map((ent) =>
        axiosInstance.get(
          `${endpoints.owprov}/api/v1/${ent.id.split('/')[0]}/${ent.id.split('/')[1]}`,
          options,
        ),
      ),
    ).then((results) => results.map((result) => result.data));

    return entities.map((ent) => ({
      ...ent,
      extraData: entityInfo.find((entity) => entity.id === ent.id.split('/')[1]),
    }));
  };

  const parseData = async (data, savedInfo) => {
    const newTree = await parseNewData(data, savedInfo, addDeviceData, transform, history);
    setTree(newTree);
  };

  const getTree = (savedMap) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity?getTree=true`, options)
      .then((response) => {
        parseData(response.data, savedMap);
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('entity.error_fetching_tree', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      });
  };

  const chooseMap = async (id) => {
    updatePreferences({ defaultNetworkMap: id });
    setEditing(false);
    if (id === '') {
      setTreeInfo(defaultTreeInfo);
      getTree();
    } else if (id === 'create') {
      setEditing(true);
      setTreeInfo({ ...defaultTreeInfo, id: 'create' });
      getTree();
    } else {
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      axiosInstance
        .get(`${endpoints.owprov}/api/v1/map/${id}`, options)
        .then((response) => {
          setTreeInfo(response.data);
          getTree(response.data);
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('entity.error_fetching_tree', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        });
    }
  };

  const getMapArray = (refreshOnly = false) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/map`, options)
      .then((response) => {
        const mapsByUser = [];
        const mapsByOthers = [];

        for (let i = 0; i < response.data.list.length; i += 1) {
          if (response.data.list[i].creator === user.id) mapsByUser.push(response.data.list[i]);
          else mapsByOthers.push(response.data.list[i]);
        }
        setMyMaps(mapsByUser);
        setOthersMaps(mapsByOthers);
        if (!refreshOnly) getTree();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('entity.error_fetching_tree', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      });
  };

  const saveMap = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    // If we have an ID we have to PUT, else its a POST
    if (treeInfo.id === '' || treeInfo.id === 'create') {
      const params = {
        name: treeInfo.name,
        description: treeInfo.description,
        data: JSON.stringify(reactFlowInstance.toObject()),
        visibility: treeInfo.visibility,
        uuid: 1,
      };

      axiosInstance
        .post(`${endpoints.owprov}/api/v1/map/1`, params, options)
        .then((response) => {
          addToast({
            title: t('common.success'),
            body: t('entity.tree_saved'),
            color: 'success',
            autohide: true,
          });
          chooseMap(response.data.id);
          getMapArray(true);
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('entity.error_saving_map', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        });
    } else {
      const params = {
        name: treeInfo.name,
        description: treeInfo.description,
        data: JSON.stringify(reactFlowInstance.toObject()),
        visibility: treeInfo.visibility,
        id: treeInfo.id,
      };

      axiosInstance
        .put(`${endpoints.owprov}/api/v1/map/${treeInfo.id}`, params, options)
        .then((response) => {
          addToast({
            title: t('common.success'),
            body: t('entity.tree_saved'),
            color: 'success',
            autohide: true,
          });
          setTreeInfo(response.data);
          getMapArray();
          toggleEditing();
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('entity.error_saving_map', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        });
    }
  };

  const deleteMap = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .delete(`${endpoints.owprov}/api/v1/map/${treeInfo.id}`, options)
      .then(() => {
        addToast({
          title: t('common.success'),
          body: t('entity.map_delete_success'),
          color: 'success',
          autohide: true,
        });
        toggleDelete();
        setEditing(false);
        setTreeInfo(defaultTreeInfo);
        getMapArray();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('entity.error_deleting_map', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      });
  };

  const refreshTree = () => {
    chooseMap(treeInfo.id);
  };

  const resetLayout = () => {
    setTree(createLayoutedElements(tree, 220, 50));
    setTimeout(() => reactFlowInstance.fitView(), 100);
  };

  useEffect(() => {
    setEditing(false);
    setTreeInfo({ ...defaultTreeInfo, id: user.preferences?.defaultNetworkMap ?? '' });
    chooseMap(user.preferences?.defaultNetworkMap ?? '');
    getMapArray(true);
  }, []);

  return (
    <>
      <CCard>
        <CCardHeader className="dark-header">
          <div className="text-value-lg float-left">{t('entity.entire_tree')}</div>
          <div className="text-right float-right">
            <CButtonToolbar role="group" className="justify-content-end">
              <CLabel className="mr-2 pt-1" htmlFor="deviceType">
                {t('entity.selected_map')}
              </CLabel>
              <div style={{ width: '300px', zIndex: '1080' }} className="text-dark text-left">
                <Select
                  closeMenuOnSelect={false}
                  name="TreeMaps"
                  options={[
                    { label: 'Auto-Map', value: '' },
                    {
                      label: 'My Maps',
                      options: myMaps.map((m) => ({ value: m.id, label: m.name })),
                    },
                    {
                      label: 'Maps Created By Others',
                      options: othersMaps.map((m) => ({ value: m.id, label: m.name })),
                    },
                  ]}
                  onChange={(c) => chooseMap(c.value)}
                  value={{ value: treeInfo.id, label: treeInfo.name }}
                  formatGroupLabel={formatGroupLabel}
                />
              </div>
              <CPopover content={t('common.duplicate')}>
                <CButton
                  color="info"
                  className="ml-2"
                  onClick={toggleDuplicateModal}
                  disabled={editing}
                >
                  <CIcon content={cilPlus} />
                </CButton>
              </CPopover>
              <CPopover content={t('common.save')}>
                <CButton
                  color="info"
                  className="ml-2"
                  onClick={saveMap}
                  disabled={treeInfo.id === '' || !editing}
                >
                  <CIcon content={cilSave} />
                </CButton>
              </CPopover>
              <CPopover content="Automatically Align Map">
                <CButton color="info" className="ml-2" onClick={resetLayout}>
                  <CIcon content={cilAlignCenter} />
                </CButton>
              </CPopover>
              <CPopover content={t('common.edit')}>
                <CButton
                  color="light"
                  className="ml-2"
                  onClick={toggleEditing}
                  disabled={treeInfo.id === '' || editing}
                >
                  <CIcon content={cilPencil} />
                </CButton>
              </CPopover>
              <CPopover content={t('common.stop_editing')}>
                <CButton
                  color="light"
                  className="ml-2"
                  onClick={toggleEditing}
                  disabled={treeInfo.id === '' || !editing}
                >
                  <CIcon content={cilX} />
                </CButton>
              </CPopover>
              <CPopover content={t('common.refresh')}>
                <CButton color="info" className="ml-2" onClick={refreshTree}>
                  <CIcon content={cilSync} />
                </CButton>
              </CPopover>
              <CPopover content={t('common.delete')}>
                <CButton
                  color="danger"
                  className="ml-2"
                  onClick={toggleDelete}
                  disabled={treeInfo.id === ''}
                >
                  <CIcon content={cilTrash} />
                </CButton>
              </CPopover>
            </CButtonToolbar>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow className="my-2" hidden={!editing || treeInfo.id === 'create'}>
            <CLabel col sm="2" md="2" xl="1" htmlFor="owner">
              {t('common.creator')}
            </CLabel>
            <CCol sm="4" md="4" xl="5" className="pt-2">
              {treeInfo.creator}
            </CCol>
          </CRow>
          <CRow className="my-2" hidden={!editing}>
            <CLabel col sm="2" md="2" xl="1" htmlFor="name">
              {t('user.name')}
            </CLabel>
            <CCol sm="4" md="4" xl="5">
              <CInput
                id="name"
                type="text"
                required
                value={treeInfo.name}
                onChange={(e) => setTreeInfo({ ...treeInfo, name: e.target.value })}
                invalid={treeInfo.name.length === 0}
                disabled={false}
                maxLength="50"
              />
              <CInvalidFeedback>{t('common.required')}</CInvalidFeedback>
            </CCol>
            <CLabel col sm="2" md="2" xl="1" htmlFor="description">
              {t('user.description')}
            </CLabel>
            <CCol sm="4" md="4" xl="5">
              <CInput
                id="name"
                type="description"
                required
                value={treeInfo.description}
                onChange={(e) => setTreeInfo({ ...treeInfo, description: e.target.value })}
                disabled={false}
                maxLength="50"
              />
            </CCol>
          </CRow>
          {tree && (
            <EntityTree
              elements={tree}
              reactFlowInstance={reactFlowInstance}
              setReactFlowInstance={setReactFlowInstance}
              setElements={setTree}
              history={history}
              editable={editing}
            />
          )}
        </CCardBody>
      </CCard>
      <CModal show={deleting} onClose={toggleDelete}>
        <CModalHeader className="p-1">
          <CModalTitle className="pl-1 pt-1">
            {t('common.delete')} {treeInfo.name}
          </CModalTitle>
          <div className="text-right">
            <CPopover content={t('common.close')}>
              <CButton color="primary" variant="outline" className="ml-2" onClick={toggleDelete}>
                <CIcon content={cilX} />
              </CButton>
            </CPopover>
          </div>
        </CModalHeader>
        <CModalBody className="pt-0">
          <CAlert className="my-3" color="danger">
            {t('entity.confirm_map_delete', { name: treeInfo.name })}
          </CAlert>
          <CRow className="mb-2">
            <CCol className="text-right">
              <CButton onClick={deleteMap} color="danger">
                {t('common.delete')}
              </CButton>
            </CCol>
            <CCol>
              <CButton onClick={toggleDelete} color="light">
                {t('common.cancel')}
              </CButton>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </>
  );
};

export default TreeCard;
