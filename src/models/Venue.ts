import { DeviceRules } from './Basic';
import { Note } from './Note';

export interface VenueApiResponse {
  id: string;
  name: string;
  description: string;
  parent: string;
  devices: string[];
  children: string[];
  contacts: string[];
  entity: string;
  boards: string[];
  created: number;
  modified: number;
  configurations: string[];
  notes: Note[];
  variables: string[];
  location: string;
  sourceIP: string[];
  deviceRules: DeviceRules;
}
