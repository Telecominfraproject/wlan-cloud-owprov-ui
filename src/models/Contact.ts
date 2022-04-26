import { Note } from './Note';

export interface Contact {
  name: string;
  description: string;
  id: string;
  notes: Note[];
}
