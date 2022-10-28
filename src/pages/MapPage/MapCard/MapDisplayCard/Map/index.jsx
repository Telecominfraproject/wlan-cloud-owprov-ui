import React, { forwardRef, useEffect, useState, useImperativeHandle, useCallback } from 'react';
import { Center } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import ReactFlow, { MiniMap, Controls, useNodesState, useEdgesState } from 'react-flow-renderer';
import { useNavigate } from 'react-router-dom';
import { mapToFlowElements, rfInstanceToSave } from './dagreAdapter';
import DeviceNode from './DeviceNode';
import EntityNode from './EntityNode';
import MapLegend from './MapLegend';
import VenueNode from './VenueNode';

const nodeTypes = {
  entity: EntityNode,
  venue: VenueNode,
  device: DeviceNode,
};

const propTypes = {
  selectedMap: PropTypes.shape({
    id: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    tree: PropTypes.instanceOf(Object).isRequired,
    flatTree: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
    entities: PropTypes.instanceOf(Object).isRequired,
    venues: PropTypes.instanceOf(Object).isRequired,
    tags: PropTypes.instanceOf(Object).isRequired,
    devices: PropTypes.instanceOf(Object).isRequired,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
};

const defaultProps = {
  selectedMap: null,
};

const Map = forwardRef(({ data, selectedMap, isEditing }, ref) => {
  const [elements, setElements] = useState(mapToFlowElements(data, selectedMap));
  const [nodes, setNodes, onNodesChange] = useNodesState(elements.filter(({ type }) => type !== undefined));
  const [edges, setEdges, onEdgesChange] = useEdgesState(elements.filter(({ type }) => type === undefined));
  const [rfInstance, setRfInstance] = useState(null);
  const navigate = useNavigate();

  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
    setRfInstance(reactFlowInstance);
  };

  useImperativeHandle(ref, () => ({
    autoAlign() {
      setElements(mapToFlowElements({ ...data, autoAlign: true }, selectedMap));
    },
    getDataToSave() {
      let rootNode = 'entity/0000-0000-0000';
      if (selectedMap) rootNode = JSON.parse(selectedMap.data).rootNode;
      return rfInstanceToSave(rfInstance, rootNode);
    },
  }));

  const onClick = useCallback(
    (e, el) => {
      if (!isEditing) {
        const splitEl = el.id.split('/');
        const type = splitEl[0];

        if (type === 'entity' || type === 'venue') navigate(`/${type}/${splitEl[1]}`);
      }
    },
    [isEditing],
  );

  useEffect(() => {
    setElements(mapToFlowElements(data, selectedMap));
  }, [data, selectedMap, isEditing]);

  useEffect(() => {
    setNodes(elements.filter(({ type }) => type !== undefined));
    setEdges(elements.filter(({ type }) => type === undefined));
  }, [elements]);

  return (
    <Center h="calc(100vh - 225px)" w="calc(100vw - 220px - 80px)">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={onLoad}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={isEditing}
        elementsSelectable={isEditing}
        nodeTypes={nodeTypes}
        onNodeClick={onClick}
      >
        <MapLegend />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.isRoot || n.data?.id === '0000-0000-0000') return 'black';
            if (n.type === 'entity') return 'var(--chakra-colors-teal-200)';
            if (n.type === 'venue') return 'var(--chakra-colors-cyan-200)';
            if (n.type === 'device') return 'var(--chakra-colors-blue-200)';

            return '#fff';
          }}
          nodeBorderRadius={5}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </Center>
  );
});

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;
export default React.memo(Map, isEqual);
