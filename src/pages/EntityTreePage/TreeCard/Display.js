import React from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import ReactFlow, { removeElements, MiniMap, Controls, Background } from 'react-flow-renderer';
import EntityNode from './EntityNode';
import VenueNode from './VenueNode';
import EntityTooltip from './EntityTooltip';
import VenueTooltip from './VenueTooltip';
import Legend from './Legend';

const nodeTypes = {
  entity: EntityNode,
  venue: VenueNode,
};

const tooltips = (elements) => {
  const arr = [];

  for (const el of elements) {
    if (el.type === 'entity' && el.extraData.id !== '0000-0000-0000') {
      arr.push(<EntityTooltip key={createUuid()} data={el.data} />);
    } else {
      arr.push(<VenueTooltip key={createUuid()} data={el.data} />);
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
    if (mode === 'edit') return null;
    if (mode === 'view') return goToEntity(e, el);

    return toggleDuplicateFromNode(el);
  };

  const onLoad = (instance) => {
    setReactFlowInstance(instance);
  };

  const onNodeDragStop = (event, node) => {
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
        height: mode === 'edit' ? 'calc(100vh - 350px)' : 'calc(100vh - 250px)',
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
        <Background color="#aaa" gap={20} />
      </ReactFlow>
      {mode === 'view' ? tooltips(elements) : null}
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
