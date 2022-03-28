export const lowercaseFirstLetter = (initial) => (initial ? initial.charAt(0).toLowerCase() + initial.slice(1) : null);
export const uppercaseFirstLetter = (initial) => (initial ? initial.charAt(0).toUpperCase() + initial.slice(1) : null);
export const bytesString = (bytes, decimals = 2) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes || bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};
export const parseDbm = (value) => {
  if (value === undefined || value === null) return '-';
  if (value > -150 && value < 100) return value;
  return (4294967295 - value) * -1;
};
