import dagre from 'dagre';
import { isNode } from 'react-flow-renderer';

export const setupDag = (elements, nodeWidth, nodeHeight) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    const newElement = el;
    if (isNode(newElement)) {
      const nodeWithPosition = dagreGraph.node(newElement.id);
      newElement.targetPosition = 'top';
      newElement.sourcePosition = 'bottom';
      newElement.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return newElement;
  });
};

// Extracts tree originating from root node
export const extractRootNode = (tree, rootNode) => {
  if (`${tree.type}/${tree.uuid}` === rootNode) {
    return tree;
  }
  let result = null;

  for (const child of tree.children) {
    result = extractRootNode(child, rootNode);

    if (result !== null) return result;
  }
  for (const child of tree.venues ?? []) {
    result = extractRootNode(child, rootNode);
    if (result !== null) return result;
  }

  return result;
};

// Flattening entity/venue tree to [{ id: '${type}/${uuid}'}]
const flattenTree = (tree) => {
  let newArray = [];

  newArray.push(tree.uuid);

  let childrenArray = [];
  for (const child of tree.children) {
    childrenArray = childrenArray.concat(flattenTree(child));
  }
  newArray = newArray.concat(childrenArray);

  let venuesArray = [];
  for (const venue of tree.venues ?? []) {
    venuesArray = venuesArray.concat(flattenTree(venue));
  }
  newArray = newArray.concat(venuesArray);

  return newArray;
};

// Return the right list of elements from a root node
export const flatTreeFromRootNode = (tree, rootNode) => {
  const treeFromRoot = extractRootNode(tree, rootNode);
  return flattenTree(treeFromRoot ?? tree);
};

// Generating a list of map elements automatically with dagre or with a saved map
export const mapToFlowElements = ({ tree, flatTree, tags, devices, autoAlign = false }, savedMap) => {
  const elements = [];

  for (const el of flatTree) {
    elements.push({
      id: `${el.type}/${el.id}`,
      type: el.type,
      data: {
        label: el.name,
        ...el,
      },
    });

    if (el.parentId)
      elements.push({
        id: `edge/${el.parentType}/${el.parentId}/${el.type}/${el.id}`,
        source: `${el.parentType}/${el.parentId}`,
        target: `${el.type}/${el.id}`,
      });
  }

  for (const tag of tags) {
    elements.push({
      id: `device/${tag.serialNumber}`,
      type: 'device',
      data: {
        label: tag.serialNumber,
        tag,
        device: devices.find((device) => device.deviceInfo.serialNumber === tag.serialNumber),
      },
    });

    elements.push({
      id: `edge/${tag.parentType}/${tag.parentId}/device/${tag.serialNumber}`,
      source: `${tag.parentType}/${tag.parentId}`,
      target: `device/${tag.serialNumber}`,
    });
  }

  // If we are using the Auto Map, we stop here and use dagre for layout
  if (!savedMap) return setupDag(elements, 200, 60);
  const parsedMap = JSON.parse(savedMap.data);
  const rootNode = parsedMap.rootNode ?? '0000-0000-0000';

  const includedElements = flatTreeFromRootNode(tree, parsedMap.rootNode);

  const finalElements = [];
  for (let i = 0; i < elements.length; i += 1) {
    const el = elements[i];
    const splitEl = el.id.split('/');
    const type = splitEl[0];
    const id = splitEl[1];

    // If the element is an edge, we verify that the source and target are in includedElements array
    if (type === 'edge') {
      const sourceId = el.source.split('/')[1];
      const targetType = el.target.split('/')[0];
      const targetId = el.target.split('/')[1];
      if (targetType === 'device') {
        if (includedElements.find((incl) => incl === sourceId)) finalElements.push(el);
      } else if (
        includedElements.find((incl) => incl === sourceId) &&
        includedElements.find((incl) => incl === targetId)
      ) {
        finalElements.push(el);
      }
    } else if (type === 'entity' || type === 'venue') {
      const found = includedElements.find((incl) => incl === id);
      if (found) {
        const foundSaved = parsedMap.elements.find((saved) => saved.id === el.id);
        finalElements.push({
          ...el,
          data: {
            ...el.data,
            isRoot: el.id === rootNode,
          },
          position: foundSaved ? foundSaved.position : { x: 0, y: 0 },
        });
      }
    } else if (type === 'device') {
      const found = includedElements.find((incl) => incl === el.data.tag.entity || incl === el.data.tag.venue);
      if (found) {
        const foundSaved = parsedMap.elements.find((saved) => saved.id === el.id);
        finalElements.push({
          ...el,
          position: foundSaved ? foundSaved.position : { x: 0, y: 0 },
        });
      }
    }
  }

  return autoAlign ? setupDag(finalElements, 200, 60) : finalElements;
};

// Extract compact elements and zoom/position data from react-flow instance
export const rfInstanceToSave = (rf, rootNode) => {
  if (rf) {
    const obj = rf.toObject();

    const elements = obj.elements
      .filter((el) => el.source === undefined)
      .map((el) => ({
        id: el.id,
        position: el.position,
      }));

    return {
      elements,
      zoom: obj.zoom,
      position: obj.position,
      rootNode,
    };
  }

  return {
    elements: [],
    zoom: 0.5,
    position: [0, 0],
    rootNode,
  };
};
