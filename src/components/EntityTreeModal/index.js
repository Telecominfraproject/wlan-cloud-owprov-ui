import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAlignCenter, cilSave, cilSync, cilX } from '@coreui/icons';
import { useHistory } from 'react-router-dom';
import { useAuth, EntityTree } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import { useZoomPanHelper } from 'react-flow-renderer';
import createLayoutedElements from './dagreAdapter';
import { entityStyle, node, venueStyle, worldStyle } from './nodes';

const iterateThroughTree = (el) => {
  let newArray = [];

  if (el.type === 'entity') {
    newArray.push({
      id: `${el.type}/${el.uuid}`,
      data: { label: node(el) },
      entityName: el.name,
      position: { x: 0, y: 200 },
      type: 'default',
      style: el.uuid === '0000-0000-0000' ? worldStyle : entityStyle,
    });

    // Creating edges for children and venues
    for (const child of el.children) {
      newArray.push({
        id: `edge/${el.uuid}/${child.uuid}`,
        source: `${el.type}/${el.uuid}`,
        target: `${child.type}/${child.uuid}`,
        arrowHeadType: 'arrowclosed',
      });
    }
    for (const child of el.venues) {
      newArray.push({
        id: `edge/${el.uuid}/${child.uuid}`,
        source: `${el.type}/${el.uuid}`,
        target: `${child.type}/${child.uuid}`,
        arrowHeadType: 'arrowclosed',
      });
    }

    // Creating children/venue elements
    let childrenArray = [];
    for (const child of el.children) {
      childrenArray = childrenArray.concat(iterateThroughTree(child));
    }
    for (const child of el.venues) {
      childrenArray = childrenArray.concat(iterateThroughTree(child));
    }
    newArray = newArray.concat(childrenArray);
  } else {
    newArray.push({
      id: `${el.type}/${el.uuid}`,
      data: { label: node(el) },
      entityName: el.name,
      position: { x: 0, y: 200 },
      type: 'default',
      style: venueStyle,
    });

    for (const child of el.children) {
      newArray.push({
        id: `edge/${el.uuid}/${child.uuid}`,
        source: `${el.type}/${el.uuid}`,
        target: `${child.type}/${child.uuid}`,
        arrowHeadType: 'arrowclosed',
      });
    }

    for (const child of el.children) {
      newArray = newArray.concat(iterateThroughTree(child));
    }
  }

  return newArray;
};

const EntityTreeModal = ({ show, toggle }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { endpoints, currentToken } = useAuth();
  const [tree, setTree] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [restored, setRestored] = useState(false);

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

  const parseData = async (data) => {
    const newTree = iterateThroughTree(data, history);

    const oldFlow = localStorage.getItem('entityMap');

    if (oldFlow) {
      const parsed = JSON.parse(oldFlow);
      const fixedElements = parsed.elements.map((el) => ({
        ...el,
        data: {
          label: (
            <div className="align-middle">
              <h3 className="align-middle mb-0 font-weight-bold">{el.entityName}</h3>
            </div>
          ),
        },
      }));

      // Verifying if there are elements in our old tree that were deleted in the DB
      let [x, y] = [0, 0];
      const onlyExistingElements = fixedElements.filter((el) => {
        if (el.position?.y <= y) [x, y] = [el.position.x, el.position.y];
        return newTree.find((newEl) => el.id === newEl.id);
      });

      // Verifying if we are missing elements in our old tree that were added in the DB
      let posDiff = 1;
      for (const newEl of newTree) {
        if (!onlyExistingElements.find((el) => el.id === newEl.id)) {
          onlyExistingElements.push({
            ...newEl,
            position: { x: x + 100 + posDiff * 100, y: y - 100 + posDiff * 10 },
          });
          posDiff += 1;
        }
      }

      [x = 0, y = 0] = parsed.position;
      transform({ x, y, zoom: parsed.zoom || 0 });
      setRestored(true);
      const withDevices = await addDeviceData(onlyExistingElements);
      setTree(
        withDevices.map((ent) => ({
          ...ent,
          data: {
            label: (
              <div className="align-middle">
                <h3 className="align-middle mb-0 font-weight-bold">{ent.entityName}</h3>
                <h5 className="align-middle mb-0 font-weight-bold">
                  {ent.extraData.devices.length} Devices
                </h5>
              </div>
            ),
          },
        })),
      );
    } else {
      setTree(newTree);
      setTimeout(() => reactFlowInstance.fitView(), 100);
    }
  };

  const saveLayout = () => {
    if (reactFlowInstance) {
      const flow = JSON.stringify(reactFlowInstance.toObject());
      localStorage.setItem('entityMap', flow);
    }
  };

  const resetLayout = () => {
    setRestored(false);
    setTimeout(() => reactFlowInstance.fitView(), 100);
  };

  const getTree = () => {
    setRestored(false);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity?getTree=true`, options)
      .then((response) => {
        parseData(response.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (show) getTree();
  }, [show]);

  return (
    <CModal size="xl" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('entity.entire_tree')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.save')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={saveLayout}>
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content="Automatically Align Map">
            <CButton color="primary" variant="outline" className="ml-2" onClick={resetLayout}>
              <CIcon content={cilAlignCenter} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.refresh')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={getTree}>
              <CIcon content={cilSync} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody>
        <EntityTree
          show={show}
          elements={restored ? tree : createLayoutedElements(tree, 220, 50)}
          reactFlowInstance={reactFlowInstance}
          setReactFlowInstance={setReactFlowInstance}
          setElements={setTree}
          history={history}
          toggle={toggle}
        />
      </CModalBody>
    </CModal>
  );
};

EntityTreeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default EntityTreeModal;
