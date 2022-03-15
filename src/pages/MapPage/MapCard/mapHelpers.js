import { axiosGw, axiosProv } from 'utils/axiosInstances';

export const getTags = async (devices) =>
  axiosProv
    .get(`inventory?select=${devices.join(',')}&withExtendedInfo=true`)
    .then(({ data: { taglist } }) =>
      taglist.map((tag) => ({
        ...tag,
        parentId: tag.entity !== '' ? tag.entity : tag.venue,
        parentType: tag.entity !== '' ? 'entity' : 'venue',
      })),
    )
    .catch(() => []);
export const getDevices = async (devices) =>
  axiosGw
    .get(`devices?completeInfo=true&select=${devices.join(',')}`)
    .then(({ data: { devices: devs } }) => devs)
    .catch(() => []);

// Transforming the nested entity/venue tree object into an array ready to use with the map
export const flattenEntityTree = (
  { uuid: id, name, type, children, venues = [] },
  parentType,
  parentId,
  parentArr,
) => {
  let newArray = [];

  const newParentArr = parentId !== undefined ? [...parentArr, { parentId, parentType }] : [];

  newArray.push({
    id,
    name,
    type,
    parentType,
    parentId,
    parentArr: newParentArr,
  });

  let childrenArray = [];
  for (const child of children) {
    childrenArray = childrenArray.concat(flattenEntityTree(child, type, id, newParentArr));
  }
  newArray = newArray.concat(childrenArray);

  let venuesArray = [];
  for (const venue of venues) {
    venuesArray = venuesArray.concat(flattenEntityTree(venue, type, id, newParentArr));
  }
  newArray = newArray.concat(venuesArray);

  return newArray;
};

// Transforming an entity/venue array into an object with key as the entity/venue id
export const entitiesToObj = (entities) => {
  const obj = {};
  let devices = [];

  for (const ent of entities) {
    obj[ent.id] = ent;
    devices = devices.concat(ent.devices);
  }

  return { obj, devices };
};

// Merging the entity array with the detailed entity/venue data
export const detailsTree = (flatTree, entities, venues) => {
  const newTree = flatTree.map((obj) => {
    const newObj = obj;
    newObj.details = newObj.type === 'entity' ? entities[newObj.id] : venues[newObj.id];

    return newObj;
  });

  const treeLength = newTree.length;

  const finalTree = newTree.map((obj) => {
    const newObj = obj;

    let cumulativeDevices = newObj.details.devices ? newObj.details.devices.length : 0;
    for (let i = 0; i < treeLength; i += 1) {
      if (newTree[i].parentArr.find((parent) => parent.parentId === newObj.id)) {
        cumulativeDevices += newTree[i].details.devices.length;
      }
    }
    newObj.details.cumulativeDevices = cumulativeDevices;

    return newObj;
  });

  return finalTree;
};
