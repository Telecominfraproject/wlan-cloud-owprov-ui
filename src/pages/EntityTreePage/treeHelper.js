import React from 'react';
import createLayoutedElements from './dagreAdapter';

const worldStyle = {
  background: '#0F0A0A',
  color: 'white',
  border: '1px solid #777',
  width: 250,
  padding: 20,
  borderRadius: '0px',
};

const entityStyle = {
  background: '#2292A4',
  color: 'white',
  width: 250,
  padding: 15,
  borderRadius: '5px',
};

const venueStyle = {
  background: '#F5EFED',
  color: 'black',
  width: 250,
  padding: 10,
  borderRadius: '60px',
};

const node = (entity) => (
  <div className="align-middle">
    <h3 className="align-middle mb-0 font-weight-bold">{entity.name}</h3>
  </div>
);

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

export default async (data, savedInfo, addDeviceData, transform, history) => {
  const newTree = iterateThroughTree(data, history);

  if (savedInfo) {
    const parsed = JSON.parse(savedInfo.data);
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
    const withDevices = await addDeviceData(onlyExistingElements);
    return withDevices.map((ent) => ({
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
    }));
  }
  const withDevices = await addDeviceData(newTree);
  return createLayoutedElements(
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
    220,
    50,
  );
};
