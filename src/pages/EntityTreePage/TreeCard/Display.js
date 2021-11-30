import React from 'react';
import PropTypes from 'prop-types';
import ReactFlow, { removeElements, MiniMap, Controls, Background } from 'react-flow-renderer';

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

  // Footer height 50px, top is 64px, header is 38 + 39 = 191
  return (
    <div style={{ height: 'calc(100vh - 250px)', width: '100%' }} className="border">
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        nodesDraggable={mode === 'edit'}
        elementsSelectable={mode === 'edit'}
        onElementClick={onClick}
        onNodeDragStop={onNodeDragStop}
        deleteKeyCode={null}
        onLoad={onLoad}
        snapToGrid
        snapGrid={[10, 10]}
      >
        <div className="float-left pl-2 pt-2">
          <div
            className="align-middle text-center mx-auto mb-2"
            style={{
              backgroundColor: '#0F0A0A',
              color: 'white',
              height: '30px',
              borderRadius: '50%',
            }}
          >
            <h4 className="align-middle mb-0 font-weight-bold">Root</h4>
          </div>
          <div
            className="align-middle text-center mx-auto mb-2"
            style={{
              backgroundColor: '#2292A4',
              color: 'white',
              width: '150px',
              borderRadius: '5px',
              borderColor: 'black',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <h4 className="align-middle mb-0 font-weight-bold">Entity</h4>
          </div>
          <div
            className="align-middle text-center mx-auto"
            style={{
              backgroundColor: '#F5EFED',
              width: '150px',
              borderRadius: '60px',
              borderColor: 'black',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <h4 className="align-middle mb-0 font-weight-bold">Venue</h4>
          </div>
        </div>
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
