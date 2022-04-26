import { Note } from './Note';

export interface Location {
  name: string;
  description: string;
  id: string;
  notes: Note[];
}

export interface AddressValue {
  long_name?: string;
  short_name?: string;
  types?: string[];
}

export interface AddressObject {
  street_number: AddressValue;
  route: AddressValue;
  administrative_area_level_3: AddressValue;
  administrative_area_level_2: AddressValue;
  administrative_area_level_1: AddressValue;
  locality: AddressValue;
  postal_code: AddressValue;
  country: AddressValue;
  geoCode?: string;
}

export interface GoogleResult {
  value: {
    address_components: AddressValue[];
    geometry: {
      location: string;
    };
  };
  label: string;
}
