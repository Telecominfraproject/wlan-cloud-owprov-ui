import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import { CPopover, CButton, CAlert } from '@coreui/react';
import { cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactFlow, { removeElements, MiniMap, Controls } from 'react-flow-renderer';
import { Modal, useToggle } from 'ucentral-libs';
import EntityNode from '../Nodes/EntityNode';
import VenueNode from '../Nodes/VenueNode';
import EntityTooltip from '../Nodes/EntityTooltip';
import VenueTooltip from '../Nodes/VenueTooltip';
import DeviceTooltip from '../Nodes/DeviceTooltip';
import Legend from './Legend';
import DeviceNode from '../Nodes/DeviceNode';

const nodeTypes = {
  entity: EntityNode,
  venue: VenueNode,
  device: DeviceNode,
};

const tooltips = (elements) => {
  const arr = [];

  for (const el of elements) {
    if (el.type === 'entity' && el.extraData.id !== '0000-0000-0000') {
      arr.push(<EntityTooltip key={createUuid()} data={el.data} />);
    } else if (el.type === 'venue') {
      arr.push(<VenueTooltip key={createUuid()} data={el.data} />);
    } else if (el.type === 'device') {
      arr.push(<DeviceTooltip key={createUuid()} data={el.data} />);
    }
  }

  return arr;
};

const EntityTree = ({
  elements,
  setElements,
  history,
  setReactFlowInstance,
  mode,
  toggleDuplicateFromNode,
}) => {
  const { t } = useTranslation();
  const [editModeWarning, toggleEditModeWarning] = useToggle(false);
  const [duplicateWarning, toggleDuplicateWarning] = useToggle(false);

  const onElementsRemove = (elementsToRemove) => {
    setElements((els) => removeElements(elementsToRemove, els));
  };

  const goToEntity = (e, el) => {
    const split = el.id.split('/');
    const type = split[0];

    if (type === 'entity' || type === 'world') {
      history.push(`/entity/${split[1]}`);
    } else if (type === 'venue') {
      history.push(`/venue/${split[1]}`);
    }
  };

  const onClick = (e, el) => {
    if (mode === 'edit') return toggleEditModeWarning();
    if (mode === 'view') return goToEntity(e, el);

    return el.type !== 'device' && el.type !== 'edge'
      ? toggleDuplicateFromNode(el)
      : toggleDuplicateWarning();
  };

  const onLoad = (instance) => {
    setReactFlowInstance(instance);
  };

  const onNodeDragStop = (e, node) => {
    const newEls = elements;
    const index = elements.findIndex((element) => element.id === node.id);
    const newPositionNode = elements[index];
    newPositionNode.position = node.position;
    newEls.splice(index, 1, newPositionNode);
    setElements([...newEls]);
  };

  return (
    <div
      style={{
        height: mode === 'edit' ? 'calc(100vh - 320px)' : 'calc(100vh - 225px)',
        width: '100%',
      }}
      className="border"
    >
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        nodesDraggable={mode === 'edit'}
        elementsSelectable={mode === 'edit'}
        onElementClick={onClick}
        onNodeDragStop={onNodeDragStop}
        deleteKeyCode={null}
        onLoad={onLoad}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={[10, 10]}
      >
        <Legend />
        <MiniMap
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;

            return '#fff';
          }}
          nodeBorderRadius={5}
        />
        <Controls />
      </ReactFlow>
      {mode === 'view' ? tooltips(elements) : null}
      <Modal
        show={editModeWarning}
        toggle={toggleEditModeWarning}
        title={t('common.error')}
        headerButtons={
          <>
            <CPopover content={t('common.close')}>
              <CButton
                color="primary"
                variant="outline"
                className="ml-2"
                onClick={toggleEditModeWarning}
              >
                <CIcon content={cilX} />
              </CButton>
            </CPopover>
          </>
        }
      >
        <CAlert className="mt-4" color="info">
          You cannot navigate to another page while in editing mode!
        </CAlert>
      </Modal>
      <Modal
        show={duplicateWarning}
        toggle={toggleDuplicateWarning}
        title={t('common.error')}
        headerButtons={
          <>
            <CPopover content={t('common.close')}>
              <CButton
                color="primary"
                variant="outline"
                className="ml-2"
                onClick={toggleDuplicateWarning}
              >
                <CIcon content={cilX} />
              </CButton>
            </CPopover>
          </>
        }
      >
        <CAlert className="mt-4" color="info">
          You cannot choose a device as root node!
        </CAlert>
      </Modal>
    </div>
  );
};

EntityTree.propTypes = {
  elements: PropTypes.instanceOf(Array).isRequired,
  setElements: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setReactFlowInstance: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  toggleDuplicateFromNode: PropTypes.func.isRequired,
};

export default React.memo(EntityTree);
