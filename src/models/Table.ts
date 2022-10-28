import React from 'react';
import { Device } from './Device';
import { Subscriber } from './Subscriber';

export interface SubscriberCell {
  original: Subscriber;
}
export interface DeviceCell {
  original: Device;
}
export interface PageInfo {
  limit: number;
  index: number;
}
export type SortInfo = { id: string; sort: 'asc' | 'dsc' }[];

export interface Column<T> {
  id: string;
  Header: string;
  alwaysShow?: boolean;
  Footer?: string;
  accessor?: string;
  disableSortBy?: boolean;
  hasPopover?: boolean;
  customMaxWidth?: string;
  customMinWidth?: string;
  customWidth?: string;
  isMonospace?: boolean;
  Cell?: ({ cell }: { cell: { row: { original: T } } }) => React.ReactElement | string | JSX.Element;
}
