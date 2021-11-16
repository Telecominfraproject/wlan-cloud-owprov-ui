import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
  CSelect,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAlignCenter, cilPencil, cilSave, cilSync, cilTrash, cilX } from '@coreui/icons';
import { useHistory } from 'react-router-dom';
import { useAuth, useToast, EntityTree } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useZoomPanHelper } from 'react-flow-renderer';
import createLayoutedElements from './dagreAdapter';
import parseNewData from './treeHelper';

const defaultTreeInfo = {
  name: '',
  description: '',
  visibility: 'public',
  id: '',
  creator: '',
};

const EntityTreeModal = ({ show, toggle }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [tree, setTree] = useState([]);
  const [treeInfo, setTreeInfo] = useState(defaultTreeInfo);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [mapList, setMapList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    if (!savedInfo) setTimeout(() => reactFlowInstance.fitView(), 100);
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

  const chooseMap = (id) => {
    setEditing(false);
    if (id === '') setTreeInfo(defaultTreeInfo);
    else if (id === 'create') {
      setEditing(true);
      setTreeInfo({ ...defaultTreeInfo, id: 'create' });
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

  const getMapArray = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/map`, options)
      .then((response) => {
        setMapList(response.data.list);
        getTree();
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
          setTreeInfo(response.data);
          getMapArray();
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
    if (show) {
      setEditing(false);
      setTreeInfo(defaultTreeInfo);
      getMapArray();
    }
  }, [show]);

  return (
    <>
      <CModal size="xl" show={show && !deleting} onClose={toggle}>
        <CModalHeader className="p-1">
          <CModalTitle className="pl-1 pt-1">{t('entity.entire_tree')}</CModalTitle>
          <div className="text-right">
            <CLabel className="mr-2 pt-1" htmlFor="deviceType">
              {t('entity.selected_map')}
            </CLabel>
            <CSelect
              custom
              style={{ width: '200px' }}
              id="deviceType"
              type="text"
              required
              value={treeInfo.id}
              onChange={(e) => chooseMap(e.target.value)}
              disabled={false}
            >
              <option value="create">Create New Map</option>
              <option value="">Default Map</option>
              {mapList.map((map) => (
                <option value={map.id}>{map.name}</option>
              ))}
            </CSelect>
            <CPopover content={t('common.save')}>
              <CButton
                color="primary"
                variant="outline"
                className="ml-2"
                onClick={saveMap}
                disabled={treeInfo.id === '' || !editing}
              >
                <CIcon content={cilSave} />
              </CButton>
            </CPopover>
            <CPopover content="Automatically Align Map">
              <CButton color="primary" variant="outline" className="ml-2" onClick={resetLayout}>
                <CIcon content={cilAlignCenter} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.edit')}>
              <CButton
                color="primary"
                variant="outline"
                className="ml-2"
                onClick={toggleEditing}
                disabled={treeInfo.id === ''}
              >
                <CIcon content={cilPencil} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.refresh')}>
              <CButton color="primary" variant="outline" className="ml-2" onClick={refreshTree}>
                <CIcon content={cilSync} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.delete')}>
              <CButton
                color="primary"
                variant="outline"
                className="ml-2"
                onClick={toggleDelete}
                disabled={treeInfo.id === ''}
              >
                <CIcon content={cilTrash} />
              </CButton>
            </CPopover>
            <CPopover content={t('common.close')}>
              <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
                <CIcon content={cilX} />
              </CButton>
            </CPopover>
          </div>
        </CModalHeader>
        <CModalBody className="pt-0">
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
          <EntityTree
            show={show}
            elements={tree}
            reactFlowInstance={reactFlowInstance}
            setReactFlowInstance={setReactFlowInstance}
            setElements={setTree}
            history={history}
            toggle={toggle}
          />
        </CModalBody>
      </CModal>

      <CModal show={show && deleting} onClose={toggleDelete}>
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

EntityTreeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default EntityTreeModal;
