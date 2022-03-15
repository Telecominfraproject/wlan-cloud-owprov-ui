/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
export default (google) => {
  if (!google) return null;

  const obj = {
    street_number: {},
    route: {},
    administrative_area_level_3: {},
    administrative_area_level_2: {},
    administrative_area_level_1: {},
    locality: {},
    postal_code: {},
    country: {},
  };

  for (const [key] of Object.entries(obj)) {
    loop1: for (const val of google.value.address_components) {
      for (const type of val.types) {
        if (type === key) {
          obj[key] = { long_name: val.long_name, short_name: val.short_name };
          break loop1;
        }
      }
    }
  }

  return {
    label: google.label,
    geoCode: google.value.geometry.location,
    ...obj,
  };
};
