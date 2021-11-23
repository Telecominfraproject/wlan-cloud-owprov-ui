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
  CNav,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardHeader,
  CCardBody,
  CSelect,
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
import { useAuth, useToast, useToggle, EntityTree, DetailedNotesTable } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useZoomPanHelper } from 'react-flow-renderer';
import Select from 'react-select';
import createLayoutedElements from './dagreAdapter';
import parseNewData from './treeHelper';
import DuplicateModal from './DuplicateModal';

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
  const [index, setIndex] = useState(0);
  const { endpoints, currentToken, updatePreferences, user } = useAuth();
  const { addToast } = useToast();
  const [tree, setTree] = useState(null);
  const [treeInfo, setTreeInfo] = useState(defaultTreeInfo);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [othersMaps, setOthersMaps] = useState([]);
  const [myMaps, setMyMaps] = useState([]);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDuplicateModal, toggleDuplicateModal] = useToggle(false);
  const [users, setUsers] = useState([]);

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const toggleDelete = () => {
    setDeleting(!deleting);
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

    const params = {
      name: treeInfo.name,
      description: treeInfo.description,
      data: JSON.stringify(reactFlowInstance.toObject()),
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

  const duplicateMap = (details) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const params = {
      ...details,
      data: JSON.stringify(reactFlowInstance.toObject()),
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
    setEditing(false);
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
        <CCardHeader className="dark-header">
          <div className="text-value-lg float-left">{t('entity.entire_tree')}</div>
          <div className="text-right float-right">
            <CButtonToolbar role="group" className="justify-content-end">
              <CLabel className="mr-2 pt-1" htmlFor="deviceType">
                {t('entity.selected_map')}
              </CLabel>
              <div style={{ width: '300px', zIndex: '1028' }} className="text-dark text-left">
                <Select
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
        <CCardBody className="py-0">
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
                <CRow className="my-2" hidden={!editing || treeInfo.id === 'create'}>
                  <CLabel col sm="2" md="2" xl="1" htmlFor="owner">
                    {t('common.creator')}
                  </CLabel>
                  <CCol sm="4" md="4" xl="5" className="pt-2">
                    {users.find((u) => u.Id === treeInfo.creator)?.email}
                  </CCol>
                  <CLabel col sm="2" md="2" xl="1" htmlFor="visibility">
                    <div>{t('common.visibility')}:</div>
                  </CLabel>
                  <CCol sm="4" md="4" xl="5">
                    <CSelect
                      custom
                      id="visibility"
                      type="text"
                      required
                      value={treeInfo.visibility}
                      onChange={(e) => setTreeInfo({ ...treeInfo, visibility: e.target.value })}
                      disabled={treeInfo.creator !== user.Id}
                      style={{ width: '100px' }}
                      maxLength="50"
                    >
                      <option value="public">public</option>
                      <option value="private">private</option>
                    </CSelect>
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
              </>
            ) : null}
            <CTabPane active={index === 1}>
              {index === 1 ? (
                <DetailedNotesTable
                  t={t}
                  notes={treeInfo.notes}
                  addNote={addNote}
                  editable={editing}
                />
              ) : null}
            </CTabPane>
          </CTabContent>
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
      <DuplicateModal
        show={showDuplicateModal}
        toggle={toggleDuplicateModal}
        duplicateMap={duplicateMap}
      />
    </>
  );
};

export default TreeCard;
