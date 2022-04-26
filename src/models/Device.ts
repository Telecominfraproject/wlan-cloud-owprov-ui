import { Configuration } from './Configuration';
import { Note } from './Note';

export interface GatewayDevice {
  serialNumber: string;
  compatible: string;
  firmware: string;
  notes?: Note[];
}

export interface DeviceLocation {
  addressLines?: string[];
  addressLineOne?: string;
  addressLineTwo?: string;
}

export interface DeviceContact {
  primaryEmail: string;
}

export interface Device {
  name: string;
  description: string;
  operatorId: string;
  id: string;
  serialNumber: string;
  location: DeviceLocation;
  contact: DeviceContact;
  configuration?: Configuration[];
  notes?: Note[];
}

export interface EditDevice {
  name: string;
  description: string;
  operatorId?: string;
  id?: string;
  location?: {
    addressLines: string[];
  };
  serialNumber?: string;
  configuration?: Configuration[];
  notes?: Note[];
}

export interface WifiScanCommand {
  dfs: boolean;
  activeScan: boolean;
  bandwidth: '' | '20' | '40' | '80';
}

interface BssidResult {
  bssid: string;
  capability: number;
  channel: number;
  frequency: number;
  ht_oper: string;
  ies: string[];
  last_seen: number;
  signal: number;
  ssid?: string;
  meshid?: string;
  tsf: number;
  vht_oper: string;
}

export interface WifiScanResult {
  UUID: string;
  attachFile: number;
  completed: number;
  errorCode: number;
  errorText: string;
  executed: number;
  executionTime: number;
  results: {
    serial: string;
    status: {
      error: number;
      resultCode: number;
      scan: BssidResult[];
    };
  };
}

export interface DeviceScanResult {
  ssid: string;
  signal: number | string;
}
export interface ScanChannel {
  channel: number;
  devices: DeviceScanResult[];
}
