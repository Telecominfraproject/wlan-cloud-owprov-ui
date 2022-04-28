import { Note } from './Note';

export interface BasicObjectInfo {
  name: string;
  description: string;
  notes: Note[];
  id: string;
  created: number;
  modified: number;
}
