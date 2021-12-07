import { v4 as createUuid } from 'uuid';
import createLayoutedElements from './dagreAdapter';

const worldStyle = {
  background: '#0F0A0A',
  color: 'white',
  border: '1px solid #777',
  width: 175,
  padding: 10,
  borderRadius: '5px',
};

const entityStyle = {
  background: '#CCDAD1',
  width: 200,
  padding: 10,
  borderRadius: '5px',
};

const venueStyle = {
  background: '#40798C',
  color: 'white',
  width: 200,
  padding: 10,
  borderRadius: '5px',
};

const deviceStyle = {
  background: '#4B3B40',
  color: 'white',
  width: 200,
  padding: 10,
  borderRadius: '5px',
};

const iterateThroughTreeWithRoot = (el, rootNode) => {
  if (el.uuid === rootNode) {
    return el;
  }
  let result = null;

  for (const child of el.children) {
    result = iterateThroughTreeWithRoot(child, rootNode);

    if (result !== null) return result;
  }
  for (const child of el.venues ?? []) {
    result = iterateThroughTreeWithRoot(child, rootNode);
  }

  return result;
};

const iterateThroughTree = (el, rootNodeId, data) => {
  let newArray = [];

  if (el.type === 'entity') {
    const entId = `entity/${el.uuid}`;

    newArray.push({
      ...data.find((d) => d.id === entId),
      position: { x: 0, y: 200 },
      style: el.uuid === rootNodeId ? worldStyle : entityStyle,
    });

    // Finding all edges/devices linked
    const toPush = [];
    for (const element of data) {
      if (element.source === entId) {
        toPush.push(element);
        if (element.target.split('/')[0] === 'device') {
          const device = data.find((d) => d.id === `device/${element.target.split('/')[1]}`);
          if (device) toPush.push(device);
        }
      }
    }
    newArray = newArray.concat(toPush);

    // Creating children/venue elements
    let childrenArray = [];
    for (const child of el.children) {
      childrenArray = childrenArray.concat(iterateThroughTree(child, rootNodeId, data));
    }
    for (const child of el.venues) {
      childrenArray = childrenArray.concat(iterateThroughTree(child, rootNodeId, data));
    }
    newArray = newArray.concat(childrenArray);
  } else if (el.type === 'venue') {
    const entId = `venue/${el.uuid}`;

    newArray.push({
      ...data.find((d) => d.id === entId),
      position: { x: 0, y: 200 },
      style: venueStyle,
    });

    // Finding all edges/devices linked
    const toPush = [];
    for (const element of data) {
      if (element.source === entId) {
        toPush.push(element);
        if (element.target.split('/')[0] === 'device') {
          const device = data.find((d) => d.id === `device/${element.target.split('/')[1]}`);
          if (device) toPush.push(device);
        }
      }
    }
    newArray = newArray.concat(toPush);

    // Creating children/venue elements
    let childrenArray = [];
    for (const child of el.children) {
      childrenArray = childrenArray.concat(iterateThroughTree(child, rootNodeId, data));
    }

    newArray = newArray.concat(childrenArray);
  }

  return newArray;
};

export default async (rawTree, data, savedInfo, transform) => {
  const parsed = savedInfo ? JSON.parse(savedInfo) : undefined;
  const rootNodeId = parsed?.rootNode?.split('/')[1] ?? '0000-0000-0000';

  const treeWithRoot = iterateThroughTreeWithRoot(rawTree, rootNodeId);
  const newTree = iterateThroughTree(treeWithRoot, rootNodeId, data);

  if (savedInfo) {
    // Verifying if there are elements in our old tree that were deleted in the DB
    let [x, y] = [0, 0];
    const onlyExistingElements = parsed.elements.filter((el) => {
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

    return onlyExistingElements.map((ent) => {
      let style = entityStyle;
      const type = ent.id.split('/')[0];
      if (type === 'venue') style = venueStyle;
      else if (type === 'device') style = deviceStyle;
      else if (ent.id.split('/')[1] === rootNodeId) style = worldStyle;

      return {
        ...ent,
        type,
        style,
        data: { ...ent, tooltipId: createUuid() },
      };
    });
  }
  return createLayoutedElements(
    newTree.map((ent) => {
      let style = entityStyle;
      const type = ent.id.split('/')[0];
      if (type === 'venue') style = venueStyle;
      else if (type === 'device') style = deviceStyle;
      else if (ent.id.split('/')[1] === rootNodeId) style = worldStyle;

      return {
        ...ent,
        style,
        data: { ...ent, tooltipId: createUuid() },
      };
    }),
    200,
    40,
  );
};
