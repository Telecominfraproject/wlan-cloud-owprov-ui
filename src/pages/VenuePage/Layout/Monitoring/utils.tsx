/* eslint-disable no-continue */
import * as React from 'react';
import { Tag, TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import { CaretDown, CaretRight, Devices, Heart } from '@phosphor-icons/react';
import {
  AnalyticsAssociationData,
  AnalyticsBoardDevice,
  AnalyticsRadioData,
  AnalyticsSsidData,
  AnalyticsTimePointApiResponse,
} from 'models/Analytics';
import { parseDbm } from 'utils/stringHelper';

type Threshold = 'neutral' | 'warning' | 'error';

const getHealthThreshold = (health: number): Threshold => {
  if (health > 90) return 'neutral';
  if (health > 70) return 'warning';
  return 'error';
};
const getRssiThreshold = (rssi: number | '-'): Threshold => {
  if (rssi === '-' || rssi > -45) return 'neutral';
  if (rssi > -60) return 'warning';
  return 'error';
};

export const expandIcon = (childrenLength: number, isExpanded: boolean) => {
  if (childrenLength === 0) return null;
  return isExpanded ? <CaretDown size={16} weight="fill" /> : <CaretRight size={16} weight="fill" />;
};

export const ueIcon = (ues: number) => (
  <Tooltip label={`${ues} clients`}>
    <Tag colorScheme="blue" ml={1}>
      <TagLeftIcon boxSize="18px" as={Devices} weight="bold" mr={1} />
      <TagLabel>{ues}</TagLabel>
    </Tag>
  </Tooltip>
);

export const noiseIcon = (rssi: number | '-') =>
  rssi === '-' ? null : (
    <Tooltip label="Average level of noise">
      <Tag colorScheme={{ neutral: 'green', warning: 'yellow', error: 'red' }[getRssiThreshold(rssi)]} ml={1}>
        <TagLabel>{rssi}dB</TagLabel>
      </Tag>
    </Tooltip>
  );

export const healthIcon = (health: number) => (
  <Tooltip label="Latest Health">
    <Tag colorScheme={{ neutral: 'green', warning: 'yellow', error: 'red' }[getHealthThreshold(health)]} ml={1}>
      <TagLeftIcon boxSize="18px" as={Heart} mr={1} />
      <TagLabel>{health}%</TagLabel>
    </Tag>
  </Tooltip>
);

export type ParsedDashboardData = {
  devices: AnalyticsBoardDevice[];
  ignoredDevices: AnalyticsBoardDevice[];
  totalDevices: number;
  connectedPercentage: number;
  connectedDevices: number;
  disconnectedDevices: number;
  avgMemoryUsed: number;
  avgHealth: number;
  avgUptime: number;
  twoGAssociations: number;
  fiveGAssociations: number;
  sixGAssociations: number;
  deviceTypeTotals: { Unknown: number } & Record<string, number>;
  deviceFirmwareTotals: { Unknown: number } & Record<string, number>;
};

export const parseDashboardData = (data: AnalyticsBoardDevice[]): ParsedDashboardData => {
  const finalData = {
    devices: [] as AnalyticsBoardDevice[],
    ignoredDevices: [] as AnalyticsBoardDevice[],
    totalDevices: 0,
    connectedPercentage: 0,
    connectedDevices: 0,
    disconnectedDevices: 0,
    avgMemoryUsed: 0,
    avgHealth: 0,
    avgUptime: 0,
    twoGAssociations: 0,
    fiveGAssociations: 0,
    sixGAssociations: 0,
    deviceTypeTotals: { Unknown: 0 } as { Unknown: number } & Record<string, number>,
    deviceFirmwareTotals: { Unknown: 0 } as { Unknown: number } & Record<string, number>,
  };

  try {
    // Temporary values
    const finalDevices = [];
    const ignoredDevices = [];
    let totalHealth = 0;
    let totalUptime = 0;
    let totalMemory = 0;

    for (const device of data) {
      if (device.deviceType !== '') {
        const splitFirmware = device.lastFirmware.split(' / ');
        let firmware = splitFirmware.length > 1 ? splitFirmware[1] : device.lastFirmware;
        if (!firmware || device.lastFirmware.length === 0) firmware = 'Unknown';

        if (finalData.deviceFirmwareTotals[firmware]) finalData.deviceFirmwareTotals[firmware] += 1;
        else finalData.deviceFirmwareTotals[firmware] = 1;

        if (finalData.deviceTypeTotals[device.deviceType]) finalData.deviceTypeTotals[device.deviceType] += 1;
        else finalData.deviceTypeTotals[device.deviceType] = 1;

        if (device.associations_2g > 0) finalData.twoGAssociations += device.associations_2g;
        if (device.associations_5g > 0) finalData.fiveGAssociations += device.associations_5g;
        if (device.associations_6g > 0) finalData.sixGAssociations += device.associations_6g;

        device.memory = Math.round(device.memory);

        if (device.connected) {
          finalData.connectedDevices += 1;
          totalHealth += device.health;
          totalMemory += device.memory;
          totalUptime += device.uptime;
        } else finalData.disconnectedDevices += 1;

        finalDevices.push(device);
      } else {
        ignoredDevices.push(device);
        if (device.connected) {
          finalData.connectedDevices += 1;
          totalMemory += Math.round(device.memory);
          totalUptime += device.uptime;
        } else finalData.disconnectedDevices += 1;
        if (finalData.deviceFirmwareTotals.Unknown > 0) finalData.deviceFirmwareTotals.Unknown += 1;
        else finalData.deviceFirmwareTotals.Unknown = 1;
        if (finalData.deviceTypeTotals.Unknown > 0) finalData.deviceTypeTotals.Unknown += 1;
        else finalData.deviceTypeTotals.Unknown = 1;
      }
    }
    finalData.totalDevices = finalDevices.length + ignoredDevices.length;
    finalData.connectedPercentage = Math.round(
      (finalData.connectedDevices / Math.max(1, finalData.totalDevices)) * 100,
    );
    finalData.devices = finalDevices;
    finalData.avgHealth = Math.round(totalHealth / Math.max(1, finalData.connectedDevices));
    finalData.avgUptime = Math.round(totalUptime / Math.max(1, finalData.connectedDevices));
    finalData.avgMemoryUsed = Math.round(totalMemory / Math.max(1, finalData.connectedDevices));
    finalData.devices = finalDevices;
    finalData.ignoredDevices = ignoredDevices;
    return finalData;
  } catch (e) {
    return finalData;
  }
};

export type ParsedTimepointsData = {
  [serialNumber: string]: AnalyticsTimePointApiResponse[];
};

export const parseTimepointsData = (data: AnalyticsTimePointApiResponse[][]): ParsedTimepointsData => {
  const serialNumberToTimepoints: {
    [serialNumber: string]: AnalyticsTimePointApiResponse[];
  } = {};

  for (const timepoints of data) {
    for (const timepoint of timepoints) {
      if (!serialNumberToTimepoints[timepoint.serialNumber]) {
        serialNumberToTimepoints[timepoint.serialNumber] = [];
      }
      serialNumberToTimepoints[timepoint.serialNumber]?.push(timepoint);
    }
  }

  // Sort timepoints by timestamp for each device
  for (const [serialNumber, value] of Object.entries(serialNumberToTimepoints)) {
    const newVal = value.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
    serialNumberToTimepoints[serialNumber] = newVal;
  }

  return serialNumberToTimepoints;
};

export type UeMonitoringData = {
  station: string;
  timepoints: AnalyticsAssociationData[];
  deltas: {
    rxBytes: number;
    txBytes: number;
    rxPackets: number;
    txPackets: number;
  };
  rssiStatus: Threshold;
  rssi: '-' | number;
  ssid: string;
  band: string | number;
  serialNumber: string;
};

export type SsidMonitoringData = {
  bssid: string;
  ssid: string;
  timepoints: AnalyticsSsidData[];
  deltas: {
    rxBytes: number;
    txBytes: number;
    rxPackets: number;
    txPackets: number;
  };
  rssiStatus: Threshold;
  averageRssi: '-' | number;
  amountOfUes: number;
  ues: {
    [station: string]: UeMonitoringData;
  };
  band: string | number;
  serialNumber: string;
};

export type RadioMonitoringData = {
  band: string | number;
  timepoints: AnalyticsRadioData[];
  deltas: {
    rxBytes: number;
    txBytes: number;
    rxPackets: number;
    txPackets: number;
  };
  rssiStatus: Threshold;
  averageRssi: '-' | number;
  amountOfUes: number;
  ssids: {
    [bssid: string]: SsidMonitoringData;
  };
};

export type ApMonitoringData = {
  serialNumber: string;
  dashboardData: AnalyticsBoardDevice;
  timepoints: AnalyticsTimePointApiResponse[];
  deltas: {
    rxBytes: number;
    txBytes: number;
    rxPackets: number;
    txPackets: number;
  };
  ues: number;
  rssiStatus: Threshold;
  averageRssi: '-' | number;
  radios: {
    [band: number | string]: RadioMonitoringData;
  };
};

export const parseTimepointsToMonitoringData = (
  data: ParsedTimepointsData,
  dashboardData: AnalyticsBoardDevice[],
): ApMonitoringData[] => {
  const monitoringData: ApMonitoringData[] = [];

  for (const [serialNumber, ap] of Object.entries(data)) {
    const foundDashboard = dashboardData.find((d) => d.serialNumber === serialNumber);
    if (!foundDashboard) continue;

    const newApData: ApMonitoringData = {
      serialNumber,
      dashboardData: foundDashboard,
      timepoints: ap,
      deltas: {
        rxBytes: 0,
        txBytes: 0,
        rxPackets: 0,
        txPackets: 0,
      },
      ues: 0,
      rssiStatus: 'neutral',
      averageRssi: '-',
      radios: {},
    };

    // Looping through all timepoints to make sure all radios are accounted for before we go through SSIDs
    for (const timepoint of ap) {
      for (const radio of timepoint.radio_data) {
        if (!newApData.radios[radio.band]) {
          newApData.radios[radio.band] = {
            band: radio.band,
            timepoints: [radio],
            deltas: {
              rxBytes: 0,
              txBytes: 0,
              rxPackets: 0,
              txPackets: 0,
            },
            amountOfUes: 0,
            rssiStatus: 'neutral',
            averageRssi: '-',
            ssids: {},
          };
        } else {
          newApData.radios[radio.band]?.timepoints.push(radio);
        }
      }
    }

    // Looping through all timepoints to make sure all SSIDs are accounted for
    for (const timepoint of ap) {
      for (const ssid of timepoint.ssid_data) {
        // Checking if this SSID's radio is accounted for
        if (newApData.radios[ssid.band]) {
          if (!newApData.radios[ssid.band]?.ssids[ssid.bssid]) {
            (newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] = {
              bssid: ssid.bssid,
              ssid: ssid.ssid,
              timepoints: [ssid],
              deltas: {
                rxBytes: 0,
                txBytes: 0,
                rxPackets: 0,
                txPackets: 0,
              },
              amountOfUes: 0,
              rssiStatus: 'neutral',
              averageRssi: '-',
              ues: {},
              serialNumber: newApData.serialNumber,
              band: ssid.band,
            };
          } else {
            newApData.radios[ssid.band]?.ssids[ssid.bssid]?.timepoints.push(ssid);
          }

          // Looping through all of this SSID's UEs to make sure they are accounted for
          for (const ue of ssid.associations) {
            // Making sure this UE's SSID is accounted for
            if ((newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData) {
              // Making sure this UE is accounted for
              if (!newApData.radios[ssid.band]?.ssids[ssid.bssid]?.ues[ue.station]) {
                const rssi = parseDbm(ue.rssi);
                ((newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData).ues[
                  ue.station
                ] = {
                  station: ue.station,
                  timepoints: [ue],
                  deltas: {
                    rxBytes: 0,
                    txBytes: 0,
                    rxPackets: 0,
                    txPackets: 0,
                  },
                  rssiStatus: getRssiThreshold(rssi),
                  rssi,
                  serialNumber: newApData.serialNumber,
                  band: ssid.band,
                  ssid: ssid.ssid,
                };
              } else {
                newApData.radios[ssid.band]?.ssids[ssid.bssid]?.ues[ue.station]?.timepoints.push(ue);
              }

              // Adding deltas to the UEs
              (
                ((newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData).ues[
                  ue.station
                ] as UeMonitoringData
              ).deltas.rxBytes += ue.rx_bytes_delta;
              (
                ((newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData).ues[
                  ue.station
                ] as UeMonitoringData
              ).deltas.txBytes += ue.tx_bytes_delta;
              (
                ((newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData).ues[
                  ue.station
                ] as UeMonitoringData
              ).deltas.rxPackets += ue.rx_packets_delta;
              (
                ((newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData).ues[
                  ue.station
                ] as UeMonitoringData
              ).deltas.txPackets += ue.tx_packets_delta;

              // Adding deltas to the SSIDs
              (
                (newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData
              ).deltas.rxBytes += ue.rx_bytes_delta;
              (
                (newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData
              ).deltas.txBytes += ue.tx_bytes_delta;
              (
                (newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData
              ).deltas.rxPackets += ue.rx_packets_delta;
              (
                (newApData.radios[ssid.band] as RadioMonitoringData).ssids[ssid.bssid] as SsidMonitoringData
              ).deltas.txPackets += ue.tx_packets_delta;

              // Adding deltas to the radios
              (newApData.radios[ssid.band] as RadioMonitoringData).deltas.rxBytes += ue.rx_bytes_delta;
              (newApData.radios[ssid.band] as RadioMonitoringData).deltas.txBytes += ue.tx_bytes_delta;
              (newApData.radios[ssid.band] as RadioMonitoringData).deltas.rxPackets += ue.rx_packets_delta;
              (newApData.radios[ssid.band] as RadioMonitoringData).deltas.txPackets += ue.tx_packets_delta;

              // Adding deltas to the AP
              newApData.deltas.rxBytes += ue.rx_bytes_delta;
              newApData.deltas.txBytes += ue.tx_bytes_delta;
              newApData.deltas.rxPackets += ue.rx_packets_delta;
              newApData.deltas.txPackets += ue.tx_packets_delta;
            }
          }
        }
      }
    }

    // Calculate averages
    let totalApRssi = 0;
    let apAmountOfUes = 0;
    for (const [band, radio] of Object.entries(newApData.radios)) {
      let totalRadioRssi = 0;
      let totalAmountOfUes = 0;
      for (const [bssid, ssid] of Object.entries(radio.ssids)) {
        let totalSsidRssi = 0;
        let ssidAmountOfUes = 0;

        for (const ue of Object.values(ssid.ues)) {
          if (typeof ue.rssi === 'number') {
            totalSsidRssi += ue.rssi;
            totalRadioRssi += ue.rssi;
            totalAmountOfUes += 1;
            ssidAmountOfUes += 1;
          }
        }

        if (ssidAmountOfUes > 0) {
          const averageRssi = Math.round(totalSsidRssi / ssidAmountOfUes);

          ((newApData.radios[band] as RadioMonitoringData).ssids[bssid] as SsidMonitoringData).averageRssi =
            averageRssi;
          ((newApData.radios[band] as RadioMonitoringData).ssids[bssid] as SsidMonitoringData).rssiStatus =
            getRssiThreshold(averageRssi);
          ((newApData.radios[band] as RadioMonitoringData).ssids[bssid] as SsidMonitoringData).amountOfUes =
            ssidAmountOfUes;
        }
      }

      if (totalAmountOfUes > 0) {
        totalApRssi += totalRadioRssi;
        apAmountOfUes += totalAmountOfUes;

        const averageRssi = Math.round(totalRadioRssi / totalAmountOfUes);

        (newApData.radios[band] as RadioMonitoringData).averageRssi = averageRssi;
        (newApData.radios[band] as RadioMonitoringData).rssiStatus = getRssiThreshold(averageRssi);
        (newApData.radios[band] as RadioMonitoringData).amountOfUes = totalAmountOfUes;
      }
    }

    if (apAmountOfUes > 0) {
      const averageRssi = Math.round(totalApRssi / apAmountOfUes);

      newApData.averageRssi = averageRssi;
      newApData.rssiStatus = getRssiThreshold(averageRssi);
      newApData.ues = apAmountOfUes;
    }

    monitoringData.push(newApData);
  }

  return monitoringData.sort((a, b) => a.serialNumber.localeCompare(b.serialNumber));
};
