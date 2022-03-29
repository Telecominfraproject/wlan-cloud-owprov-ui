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

export const getScaledArray = (arr, minAllowed, maxAllowed) => {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (max - min === 0) return arr.map(() => (minAllowed + maxAllowed) / 2);
  return arr.map((num) => ((maxAllowed - minAllowed) * (num - min)) / (max - min) + minAllowed);
};
