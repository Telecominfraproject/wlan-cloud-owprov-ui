import { Note } from './Note';

export interface Location {
  name: string;
  description: string;
  id: string;
  notes: Note[];
}
