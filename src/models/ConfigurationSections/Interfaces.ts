export interface Ssid {
  __variableBlock?: string[];
  radius?: {
    __variableBlock?: string[];
  };
}

export interface InterfaceProps {
  vlan?: {
    __variableBlock?: string[];
  };
  ssids?: Ssid[];
}
