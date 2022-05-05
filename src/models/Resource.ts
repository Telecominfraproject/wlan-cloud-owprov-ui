import { BasicObjectInfo } from './Basic';

export interface Variable {
  prefix: string;
  type: 'json';
  value: string;
  weight: number;
}

export interface Resource extends BasicObjectInfo {
  configurations: string[];
  entity: string;
  inventory: string;
  subscriber: string;
  venue: string;
  variables: Variable[];
}
