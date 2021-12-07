import { v4 as createUuid } from 'uuid';
import createLayoutedElements from './dagreAdapter';

const worldStyle = {
  background: '#0F0A0A',
  color: 'white',
  border: '1px solid #777',
  width: 200,
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
    // Adding saved positions to info from
    let [x, y] = [0, 0];

    // Adding saved positions to array
    const elementsWithSavedPosition = newTree.map((el) => {
      let style = entityStyle;
      const type = el.id.split('/')[0];
      if (type === 'venue') style = venueStyle;
      else if (type === 'device') style = deviceStyle;
      else if (el.id.split('/')[1] === rootNodeId) style = worldStyle;

      if (el.position?.y <= y) [x, y] = [el.position.x, el.position.y];

      return {
        ...el,
        type,
        style,
        data: { ...el, tooltipId: createUuid() },
        position: parsed.elements.find((oldEl) => oldEl.id === el.id)?.position ?? undefined,
      };
    });

    let posDiff = 0;

    // Adding best-as-possible positions to entities which weren't saved
    const elementsWithAutoPosition = elementsWithSavedPosition.map((el) => {
      if (el.position) return el;

      let parent;
      if (el.type === 'entity') {
        parent = elementsWithSavedPosition.find((t) => t.id === `entity/${el.extraData.parent}`);
      }
      if (el.type === 'venue') {
        const parentId =
          el.extraData.parent !== ''
            ? `venue/${el.extraData.parent}`
            : `entity/${el.extraData.entity}`;
        parent = elementsWithSavedPosition.find(
          (t) => t.id === parentId && t.position !== undefined,
        );
      }
      if (el.type === 'device') {
        const parentId =
          el.extraData.tagInfo.venue !== ''
            ? `venue/${el.extraData.tagInfo.venue}`
            : `entity/${el.extraData.tagInfo.entity}`;
        parent = elementsWithSavedPosition.find(
          (t) => t.id === parentId && t.position !== undefined,
        );
      }
      if (parent) {
        return {
          ...el,
          position: { x: parent.position.x + 100, y: parent.position.y + 100 },
        };
      }

      posDiff += 1;
      return {
        ...el,
        position: { x: x + 100 + posDiff * 100, y: y - 100 + posDiff * 10 },
      };
    });

    [x = 0, y = 0] = parsed.position;
    transform({ x, y, zoom: parsed.zoom || 0 });

    return elementsWithAutoPosition;
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
