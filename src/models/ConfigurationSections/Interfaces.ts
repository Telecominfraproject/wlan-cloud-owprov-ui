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
  tunnel?: {
    __variableBlock?: string[];
  };
  captive?: {
    __variableBlock?: string[];
  };
  ipv4?: {
    __variableBlock?: string[];
  };
  ssids?: Ssid[];
}
