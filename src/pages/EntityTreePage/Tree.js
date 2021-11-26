import React from 'react';
import PropTypes from 'prop-types';
import ReactFlow, { removeElements, MiniMap, Controls, Background } from 'react-flow-renderer';

const EntityTree = ({ elements, setElements, history, setReactFlowInstance, editable }) => {
  const onElementsRemove = (elementsToRemove) => {
    setElements((els) => removeElements(elementsToRemove, els));
  };

  const onClick = (e, el) => {
    const split = el.id.split('/');
    const type = split[0];

    if (type === 'entity' || type === 'world') {
      history.push(`/entity/${split[1]}`);
    } else if (type === 'venue') {
      history.push(`/venue/${split[1]}`);
    }
  };

  const onLoad = (instance) => {
    setReactFlowInstance(instance);
  };

  return (
    <div style={{ height: '75vh', width: '100%' }} className="border">
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        nodesDraggable={editable}
        elementsSelectable={editable}
        onElementClick={editable ? null : onClick}
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
              width: '150px',
              borderRadius: '0px',
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
  editable: PropTypes.bool.isRequired,
};

export default React.memo(EntityTree);
