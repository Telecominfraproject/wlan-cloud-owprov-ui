export const arrayMoveIndex = (arr, startIndex, endIndex) => {
  const newArr = arr;

  newArr.splice(endIndex, 0, newArr.splice(startIndex, 1)[0]);

  return newArr;
};

export const arrayMoveIndexes = (arr, startIndex, endIndex) => {
  const newArr = arr;

  newArr.splice(endIndex, 0, newArr.splice(startIndex, 1)[0]);

  return newArr;
};
