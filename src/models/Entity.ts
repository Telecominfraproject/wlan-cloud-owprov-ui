import { DeviceRules } from './Basic';
import { Note } from './Note';

export interface Entity {
  id: string;
  name: string;
  parent: string;
  devices: string[];
  venues: string[];
  contacts: string[];
  entity: string;
  created: number;
  modified: number;
  description: string;
  deviceRules: DeviceRules;
  sourceIP: string[];
  notes: Note[];
  children: string[];
  configurations: string[];
  locations: string[];
  variables: string[];
}
