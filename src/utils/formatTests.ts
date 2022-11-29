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
export const testStaticIpv4ClassD = (str?: unknown): boolean => {
  if (!str || typeof str !== 'string') return false;
  const firstOctet = str.split('.')[0];
  if (firstOctet) {
    try {
      const firstOctetNumber = Number(firstOctet);
      if (firstOctetNumber >= 1 && (firstOctetNumber <= 223 || firstOctetNumber > 239)) return true;
    } catch {
      return false;
    }
  }
  return false;
};
export const testStaticIpv4ClassE = (str?: unknown): boolean => {
  if (!str || typeof str !== 'string') return false;
  const firstOctet = str.split('.')[0];
  if (firstOctet) {
    try {
      const firstOctetNumber = Number(firstOctet);
      if (firstOctetNumber >= 1 && firstOctetNumber <= 223 && firstOctetNumber <= 239) return true;
    } catch {
      return false;
    }
  }
  return false;
};
