import parsePhoneNumber from 'libphonenumber-js';

export default (phoneNumber) => {
  if (phoneNumber !== null) {
    const numberTest = parsePhoneNumber(`+${phoneNumber}`);
    if (numberTest) {
      return numberTest.isValid();
    }
  }
  return false;
};
