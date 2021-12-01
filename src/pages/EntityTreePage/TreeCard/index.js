import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CAlert,
  CNav,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CSpinner,
  CButton,
} from '@coreui/react';
import { useHistory } from 'react-router-dom';
import { useAuth, useToast, DetailedNotesTable } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useZoomPanHelper } from 'react-flow-renderer';
import createLayoutedElements from './dagreAdapter';
import parseNewData from './treeHelper';
import DuplicateModal from '../DuplicateModal';
import Form from './Form';
import Header from './Header';
import DeleteModal from '../DeleteModal';
import Display from './Display';

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
  const [index, setIndex] = useState(0);
  const { endpoints, currentToken, updatePreferences, user } = useAuth();
  const { addToast } = useToast();
  const [tree, setTree] = useState(null);
  const [treeInfo, setTreeInfo] = useState(defaultTreeInfo);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [othersMaps, setOthersMaps] = useState([]);
  const [myMaps, setMyMaps] = useState([]);
  const [mode, setMode] = useState('view');
  const [deleting, setDeleting] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateRoot, setDuplicateRoot] = useState(null);
  const [users, setUsers] = useState([]);
  const toggleDelete = () => {
    setDeleting(!deleting);
  };

  const toggleDuplicateModal = () => {
    setDuplicateRoot(null);
    setShowDuplicateModal(!showDuplicateModal);
  };

  const toggleDuplicateFromNode = (ent) => {
    setDuplicateRoot(ent);
    setShowDuplicateModal(true);
  };

  const { transform } = useZoomPanHelper();

  const getUsers = () => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    axiosInstance
      .get(`${endpoints.owsec}/api/v1/users`, {
        headers,
      })
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('user.error_fetching_users', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      });
  };

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
          `${endpoints.owprov}/api/v1/${ent.id.split('/')[0]}/${
            ent.id.split('/')[1]
          }?withExtendedInfo=true`,
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
    setTree(null);
    updatePreferences({ defaultNetworkMap: id });
    setMode('view');

    if (id === '') {
      setTreeInfo({ ...defaultTreeInfo });
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
          setTreeInfo({ ...response.data });
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

  const refreshTree = () => {
    chooseMap(treeInfo.id);
  };

  const toggleEditing = () => {
    if (mode === 'edit' || mode === 'duplicateFromNode') {
      setMode('view');
      refreshTree();
    } else setMode('edit');
  };

  const startDuplicateFromNode = () => {
    setMode('duplicateFromNode');
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
          if (response.data.list[i].creator === user.Id) mapsByUser.push(response.data.list[i]);
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

    const newNotes = [];

    for (let i = 0; i < treeInfo.notes.length; i += 1) {
      if (treeInfo.notes[i].new) newNotes.push({ note: treeInfo.notes[i].note });
    }

    const instance = reactFlowInstance.toObject();

    const params = {
      name: treeInfo.name,
      description: treeInfo.description,
      data: JSON.stringify({ ...instance, rootNode: instance.elements[0].id }),
      visibility: treeInfo.creator === user.Id ? treeInfo.visibility : undefined,
      notes: newNotes,
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
        getMapArray(true);
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
  };

  const duplicateMap = (details, rootNode) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const params = {
      ...details,
      data: JSON.stringify({
        ...reactFlowInstance.toObject(),
        rootNode: rootNode ? rootNode.id : undefined,
      }),
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
        toggleDuplicateModal();
      })
      .catch((e) => {
        addToast({
          title: t('common.error'),
          body: t('entity.error_saving_map', { error: e.response?.data?.ErrorDescription }),
          color: 'danger',
          autohide: true,
        });
      });
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
        setMode('view');
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

  const resetLayout = () => {
    setTree(createLayoutedElements(tree, 220, 50));
    setTimeout(() => reactFlowInstance.fitView(), 100);
  };

  const addNote = (newNote) => {
    const newNotes = treeInfo.notes;
    newNotes.unshift({
      note: newNote,
      new: true,
      created: new Date().getTime() / 1000,
      createdBy: '',
    });
    setTreeInfo({ ...treeInfo, notes: newNotes });
  };

  useEffect(() => {
    setMode('view');
    getMapArray(true);
    getUsers();
  }, []);

  useEffect(() => {
    if (user.Id) {
      setTreeInfo({ ...defaultTreeInfo, id: user.preferences?.defaultNetworkMap ?? '' });
      chooseMap(user.preferences?.defaultNetworkMap ?? '');
    }
  }, [user.Id]);

  useEffect(() => {
    if (reactFlowInstance !== null) reactFlowInstance.fitView();
  }, [reactFlowInstance?.toObject()]);

  return (
    <>
      <CCard>
        <Header
          myMaps={myMaps}
          othersMaps={othersMaps}
          chooseMap={chooseMap}
          treeInfo={treeInfo}
          toggleDuplicateModal={toggleDuplicateModal}
          resetLayout={resetLayout}
          refreshTree={refreshTree}
          toggleDelete={toggleDelete}
          toggleEditing={toggleEditing}
          startDuplicateFromNode={startDuplicateFromNode}
          mode={mode}
          saveMap={saveMap}
        />
        <CCardBody className="p-0">
          <CNav variant="tabs">
            <CNavLink
              href="#"
              active={index === 0}
              onClick={() => setIndex(0)}
              className="font-weight-bold"
            >
              {t('entity.map')}
            </CNavLink>
            <CNavLink
              href="#"
              active={index === 1}
              onClick={() => setIndex(1)}
              className="font-weight-bold"
            >
              {t('configuration.notes')}
            </CNavLink>
          </CNav>
          <CTabContent>
            {index === 0 ? (
              <>
                <Form
                  user={user}
                  users={users}
                  mode={mode}
                  treeInfo={treeInfo}
                  setTreeInfo={setTreeInfo}
                />
                {tree ? (
                  <>
                    <CAlert
                      hidden={mode !== 'duplicateFromNode'}
                      color="info"
                      className="m-3 align-middle"
                    >
                      <h3 className="font-weight-bold">
                        Click on the entity you want as the root of your new map!{' '}
                        <CButton color="danger font-weight-bold" onClick={() => setMode('view')}>
                          Click here to cancel
                        </CButton>
                      </h3>
                    </CAlert>
                    <Display
                      elements={tree}
                      reactFlowInstance={reactFlowInstance}
                      setReactFlowInstance={setReactFlowInstance}
                      setElements={setTree}
                      history={history}
                      mode={mode}
                      toggleDuplicateFromNode={toggleDuplicateFromNode}
                    />
                  </>
                ) : (
                  <div
                    style={{ height: 'calc(100vh - 250px)', width: '100%', paddingTop: '20%' }}
                    className="border text-center align-middle"
                  >
                    <CSpinner style={{ height: '5rem', width: '5rem' }} size="lg" />
                  </div>
                )}
              </>
            ) : null}
            <CTabPane active={index === 1} className="px-3 py-1">
              {index === 1 ? (
                <DetailedNotesTable
                  t={t}
                  notes={treeInfo.notes}
                  addNote={addNote}
                  editable={mode}
                />
              ) : null}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
      <DeleteModal
        show={deleting}
        toggle={toggleDelete}
        treeInfo={treeInfo}
        deleteMap={deleteMap}
      />
      <DuplicateModal
        mode={mode}
        show={showDuplicateModal}
        toggle={toggleDuplicateModal}
        treeInfo={treeInfo}
        nodeInfo={duplicateRoot}
        duplicateMap={duplicateMap}
      />
    </>
  );
};

export default TreeCard;
