export const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);

export const isJson = (string) => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};
