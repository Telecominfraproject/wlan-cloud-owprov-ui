/* eslint-disable max-len */
export const testIpv4 = (ip) => {
  const ipv4RegExp = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/gi;
  if (ip) {
    return ipv4RegExp.test(ip);
  }

  return false;
};

export const testIpv6 = (ip) => {
  const ipv6RegExp =
    /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi;
  if (ip) {
    return ipv6RegExp.test(ip);
  }

  return false;
};

export const testAlphanumWithDash = (str) => {
  const alphanumWithDashRegExp = /^[a-zA-Z0-9-_]+$/;
  if (str !== undefined) {
    return str.length === 0 ? true : alphanumWithDashRegExp.test(str);
  }

  return false;
};

export const testFqdnHostname = (str) => {
  const regex = /^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){1,127}(?![0-9]*$)[a-z0-9-]+\.?)$/;
  if (str !== undefined) {
    return str.length === 0 ? true : regex.test(str);
  }

  return false;
};

export const testLength = ({ val, min, max }) => {
  if (val) {
    const { length } = val;
    if (min !== undefined && length < min) return false;
    if (max !== undefined && length > max) return false;
    return true;
  }

  return false;
};

export const testPemCertificate = (val) => {
  if (val) {
    return val.includes('---BEGIN CERTIFICATE---') && val.includes('---END CERTIFICATE---');
  }

  return false;
};

export const testPemPrivateKey = (val) => {
  if (val) {
    return val.includes('---BEGIN PRIVATE KEY---') && val.includes('---END PRIVATE KEY---');
  }

  return false;
};

export const testMac = (mac) => {
  if (mac) {
    if (mac.length === 12) {
      if (mac.match('^[a-fA-F0-9]+$')) {
        return true;
      }
    }
  }
  return false;
};

export const testUcMac = (mac) => {
  if (mac) {
    return mac.match('^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$');
  }
  return false;
};
//

export const testJson = (string) => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};

export const testInterfacesString = (str) => {
  let result = false;
  try {
    const res = JSON.parse(str);
    result = Object.keys(res)[0] === 'interfaces' && Array.isArray(res.interfaces);
  } catch (e) {
    result = false;
  }
  return result;
};
