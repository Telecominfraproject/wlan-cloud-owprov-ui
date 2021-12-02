import { v4 as createUuid } from 'uuid';
import createLayoutedElements from './dagreAdapter';

const worldStyle = {
  background: '#0F0A0A',
  color: 'white',
  border: '1px solid #777',
  width: 175,
  padding: 10,
  borderRadius: '20%',
};

const entityStyle = {
  background: '#CCDAD1',
  color: 'black',
  width: 200,
  padding: 10,
  borderRadius: '5px',
};

const venueStyle = {
  background: '#40798C',
  color: 'white',
  width: 200,
  padding: 10,
  borderRadius: '60px',
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

const iterateThroughTree = (el, rootNodeId) => {
  let newArray = [];

  if (el.type === 'entity') {
    newArray.push({
      id: `${el.type}/${el.uuid}`,
      entityName: el.name,
      position: { x: 0, y: 200 },
      type: 'entity',
      style: el.uuid === rootNodeId ? worldStyle : entityStyle,
    });

    // Creating edges for children and venues
    for (const child of el.children) {
      newArray.push({
        id: `edge/${el.uuid}/${child.uuid}`,
        source: `${el.type}/${el.uuid}`,
        target: `${child.type}/${child.uuid}`,
        arrowHeadType: 'arrow',
        arrowHeadColor: '#000000',
      });
    }
    for (const child of el.venues) {
      newArray.push({
        id: `edge/${el.uuid}/${child.uuid}`,
        source: `${el.type}/${el.uuid}`,
        target: `${child.type}/${child.uuid}`,
        arrowHeadType: 'arrow',
        arrowHeadColor: '#000000',
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
      entityName: el.name,
      position: { x: 0, y: 200 },
      type: 'venue',
      style: venueStyle,
    });

    for (const child of el.children) {
      newArray.push({
        id: `edge/${el.uuid}/${child.uuid}`,
        source: `${el.type}/${el.uuid}`,
        target: `${child.type}/${child.uuid}`,
        arrowHeadType: 'arrow',
        arrowHeadColor: '#000000',
      });
    }

    for (const child of el.children) {
      newArray = newArray.concat(iterateThroughTree(child));
    }
  }

  return newArray;
};

export default async (data, savedInfo, addDeviceData, transform) => {
  const parsed = savedInfo ? JSON.parse(savedInfo.data) : undefined;
  const rootNodeId = parsed?.rootNode?.split('/')[1] ?? '0000-0000-0000';

  const elements = iterateThroughTreeWithRoot(data, rootNodeId);
  const newTree = iterateThroughTree(elements, rootNodeId);

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
    const withDevices = await addDeviceData(onlyExistingElements);
    return withDevices.map((ent) => {
      let style = entityStyle;
      const type = ent.id.split('/')[0];
      if (type === 'venue') style = venueStyle;
      else if (ent.id.split('/')[1] === rootNodeId) style = worldStyle;

      return {
        ...ent,
        type,
        style,
        data: { ...ent, tooltipId: createUuid() },
      };
    });
  }

  const withDevices = await addDeviceData(newTree);
  return createLayoutedElements(
    withDevices.map((ent) => ({
      ...ent,
      data: { ...ent, tooltipId: createUuid() },
    })),
    200,
    40,
  );
};
