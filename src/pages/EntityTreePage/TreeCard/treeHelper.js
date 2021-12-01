import React from 'react';
import { cilPeople, cilRouter, cilWifiSignal4 } from '@coreui/icons';
import { CPopover, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import createLayoutedElements from './dagreAdapter';

const worldStyle = {
  background: '#0F0A0A',
  color: 'white',
  border: '1px solid #777',
  width: 175,
  padding: 10,
  borderRadius: '50%',
};

const entityStyle = {
  background: '#CCDAD1',
  color: 'black',
  width: 200,
  padding: 10,
  borderRadius: '5px',
};

const venueStyle = {
  background: '#F5EFED',
  color: 'black',
  width: 200,
  padding: 10,
  borderRadius: '60px',
};

const getRrmClass = (rrm) => {
  switch (rrm) {
    case 'on':
      return 'text-success';
    case 'off':
      return 'text-danger';
    default:
      return 'text-warning';
  }
};

const nodeWithData = (ent) => {
  if (ent.extraData.id === '0000-0000-0000') {
    return (
      <div className="align-middle">
        <h5 className="align-middle font-weight-bold mb-0">{ent.entityName}</h5>
      </div>
    );
  }
  return (
    <CPopover
      content={
        <div>
          <CRow>
            <CCol>{ent.extraData.devices.length} devices</CCol>
          </CRow>
          <CRow>
            <CCol>
              {ent.extraData.contacts !== undefined
                ? `${ent.extraData.contacts} contacts`
                : `Contact: ${ent.extraData.extendedInfo.contact?.name}`}
            </CCol>
          </CRow>
          <CRow>
            <CCol>RRM: {ent.extraData.rrm}</CCol>
          </CRow>
        </div>
      }
    >
      <div className="align-middle">
        <h5 className="align-middle font-weight-bold mb-0">{ent.entityName}</h5>
        <div className="border border-dark">
          <div className="float-left ml-4 mt-1 pl-2">
            <CIcon content={cilRouter} />{' '}
          </div>
          <div className="ml-1 mt-1 font-weight-bold float-left">
            {ent.extraData.devices.length}
          </div>
          <div className="ml-3 mt-1 float-left">
            <CIcon className={getRrmClass(ent.extraData.rrm)} content={cilWifiSignal4} />
          </div>
          <div className="ml-3 mt-1 float-left">
            <CIcon content={cilPeople} />
          </div>
          <div className="ml-1 mt-1 font-weight-bold float-left">
            {ent.extraData.contacts?.length ?? ''}
          </div>
        </div>
      </div>
    </CPopover>
  );
};

const node = (entity) => (
  <div className="align-middle">
    <h5 className="align-middle mb-0 font-weight-bold">{entity.name}</h5>
  </div>
);

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
      data: { label: node(el) },
      entityName: el.name,
      position: { x: 0, y: 200 },
      type: 'default',
      style: el.uuid === rootNodeId ? worldStyle : entityStyle,
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
      if (ent.id.split('/')[0] === 'venue') style = venueStyle;
      else if (ent.id.split('/')[1] === rootNodeId) style = worldStyle;

      return {
        ...ent,
        style,
        data: {
          label: nodeWithData(ent),
        },
      };
    });
  }

  const withDevices = await addDeviceData(newTree);
  return createLayoutedElements(
    withDevices.map((ent) => ({
      ...ent,
      data: {
        label: nodeWithData(ent),
      },
    })),
    200,
    40,
  );
};
