const PREFERENCE = 'provisioning.entityTree.expandedKeys';

export const getExpandedKeys = (): string[] => {
  const expandedKeys = localStorage.getItem(PREFERENCE);
  if (expandedKeys) {
    try {
      return JSON.parse(expandedKeys);
    } catch (e) {
      return [];
    }
  }
  return [];
};

export const setExpandedKeys = (keys: { [key: string]: boolean }) => {
  const arr = Object.keys(keys).filter((key) => keys[key] === true);
  localStorage.setItem(PREFERENCE, JSON.stringify(arr));
};
