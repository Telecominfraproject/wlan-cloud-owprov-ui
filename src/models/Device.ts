import { Configuration } from './Configuration';
import { Note } from './Note';

export interface GatewayDevice {
  serialNumber: string;
  compatible: string;
  notes?: Note[];
}

export interface Device {
  name: string;
  description: string;
  operatorId: string;
  id: string;
  serialNumber: string;
  configuration?: Configuration[];
  notes?: Note[];
}

export interface EditDevice {
  name: string;
  description: string;
  operatorId?: string;
  id?: string;
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
  ies: any[];
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

interface DeviceScanResult {
  ssid: string;
  signal: number | string;
}
export interface ScanChannel {
  channel: number;
  devices: DeviceScanResult[];
}
