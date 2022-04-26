export const findDuplicates = (arr: Array<unknown>): Array<unknown> =>
  arr.filter((item, index) => arr.indexOf(item) !== index);

export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
