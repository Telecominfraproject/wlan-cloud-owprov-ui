export const findDuplicates = (arr: Array<any>): Array<any> => arr.filter((item, index) => arr.indexOf(item) !== index);

export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
