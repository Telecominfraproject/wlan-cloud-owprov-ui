import { ReactNode } from 'react';

export interface Route {
  authorized: string[];
  path: string;
  navName: string;
  icon: (active: boolean) => ReactNode;
  isEntity: boolean;
  component: any;
}
