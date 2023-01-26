import { Note } from './Note';

export type CreateContactObj = {
  name: string;
  description?: string;
  notes?: Note[];
  id?: string;
  type:
    | 'SUBSCRIBER'
    | 'USER'
    | 'INSTALLER'
    | 'CSR'
    | 'MANAGER'
    | 'BUSINESSOWNER'
    | 'TECHNICIAN'
    | 'CORPORATE'
    | 'UNKNOWN';
  title?: string;
  salutation?: string;
  firstname: string;
  lastname?: string;
  initials?: string;
  visual?: string;
  phones: string[];
  mobiles: string[];
  primaryEmail: string;
  secondaryEmail?: string;
  accessPIN: string;
  inUse?: string[];
  entity: string;
};

export type ContactObj = {
  name: string;
  description: string;
  notes: Note[];
  id: string;
  created: number;
  modified: number;
  type:
    | 'SUBSCRIBER'
    | 'USER'
    | 'INSTALLER'
    | 'CSR'
    | 'MANAGER'
    | 'BUSINESSOWNER'
    | 'TECHNICIAN'
    | 'CORPORATE'
    | 'UNKNOWN';
  title: string;
  salutation: string;
  firstname: string;
  lastname: string;
  initials: string;
  visual: string;
  phones: string[];
  mobiles: string[];
  primaryEmail: string;
  secondaryEmail: string;
  accessPIN: string;
  inUse: string[];
  entity: string;
};

export interface Contact {
  name: string;
  description: string;
  id: string;
  notes: Note[];
}
