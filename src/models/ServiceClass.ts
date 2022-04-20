import { Note } from './Note';

export interface ServiceClass {
  name: string;
  description: string;
  id: string;
  notes: Note[];
}
