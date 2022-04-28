import { BasicObjectInfo } from './Basic';

interface Variable {
  prefix: string;
  type: string;
  weight: number;
  value: string;
}

export interface VariableBlock extends BasicObjectInfo {
  entity: string;
  variables: Variable[];
}
