import { v4 as uuid } from 'uuid';
import {
  AnalyticsApData,
  AnalyticsAssociationData,
  AnalyticsBoardDevice,
  AnalyticsRadioData,
  AnalyticsSsidData,
  AnalyticsTimePointApiResponse,
} from 'models/Analytics';
import { VenueApiResponse } from 'models/Venue';
import { getScaledArray } from 'utils/arrayHelpers';
import { errorColor, getBlendedColor, successColor, warningColor } from 'utils/colors';
import { parseDbm } from 'utils/stringHelper';

type ChangeTypeOfKeys<T extends object, Keys extends keyof T, NewType> = {
  // Loop to every key. We gonna check if the key
  // is assignable to Keys. If yes, change the type.
  // Else, retain the type.
  [key in keyof T]: key extends Keys ? NewType : T[key];
};

type CircleColor = 'green' | 'yellow' | 'red';

export type AssociationCircle = {
  name: string;
  type: 'association';
  details: ChangeTypeOfKeys<AnalyticsAssociationData, 'rssi', number | '-'> & {
    color: string;
    tagColor: CircleColor;
  };
  scale: number;
  totalBw: number;
};

export type SsidCircle = {
  name: string;
  type: 'ssid';
  details: {
    avgRssi: '-' | number;
    color: string;
    tagColor: CircleColor;
  } & AnalyticsSsidData;
  children: AssociationCircle[];
  scale: number;
};
export type RadioCircle = {
  name: string;
  type: 'radio';
  details: {
    color: string;
    tagColor: CircleColor;
  } & AnalyticsRadioData;
  children: SsidCircle[];
};

export type DeviceCircleInfo = {
  name: string;
  type: 'device';
  details: {
    deviceInfo: AnalyticsBoardDevice;
    ssidData: AnalyticsSsidData[];
    apData: AnalyticsApData;
    color: string;
    tagColor: CircleColor;
  };
  scale: number;
  children: RadioCircle[];
};

export type CirclePackRoot = {
  name: string;
  type: 'venue';
  details: {
    avgHealth: number;
    color: string;
    tagColor: CircleColor;
  };
  children: DeviceCircleInfo[];
  scale: number;
};

export const parseAnalyticsTimepointsToCirclePackData = (
  data: AnalyticsTimePointApiResponse[],
  venue: VenueApiResponse,
  colorMode: 'light' | 'dark',
) => {
  if (data.length === 0) return undefined;

  const root: CirclePackRoot = {
    name: venue.name,
    details: {
      avgHealth: 0,
      color: 'green',
      tagColor: 'green',
    },
    type: 'venue',
    children: [],
    scale: 1,
  };

  let globalVenueHealth = 0;
  const globalBandwidth: number[] = [];

  for (const device of data) {
    globalVenueHealth += device.device_info.health;

    const deviceCircleInfo: DeviceCircleInfo = {
      name: `${device.device_info.serialNumber}/device/${uuid()}`,
      type: 'device',
      details: {
        deviceInfo: device.device_info,
        ssidData: device.ssid_data,
        apData: device.ap_data,
        color: 'green',
        tagColor: 'green',
      },
      scale: 1,
      children: [],
    };

    if (device.device_info.health >= 90) {
      deviceCircleInfo.details.color = successColor(colorMode);
      deviceCircleInfo.details.tagColor = 'green';
    } else if (device.device_info.health >= 70) {
      deviceCircleInfo.details.color = warningColor(colorMode);
      deviceCircleInfo.details.tagColor = 'yellow';
    } else {
      deviceCircleInfo.details.color = errorColor(colorMode);
      deviceCircleInfo.details.tagColor = 'red';
    }

    const radioChannelIndex: { [key: string]: number } = {};

    for (const [i, radio] of device.radio_data.entries()) {
      radioChannelIndex[radio.band] = i;

      let tagColor: CircleColor = 'green';
      if (radio.transmit_pct > 30) tagColor = 'yellow';
      else if (radio.transmit_pct > 50) tagColor = 'red';

      deviceCircleInfo.children.push({
        name: `${radio.band}/radio/${uuid()}`,
        type: 'radio',
        details: {
          ...radio,
          color: getBlendedColor('#0ba057', '#FD3049', radio.transmit_pct / 100),
          tagColor,
        },
        children: [],
      });
    }

    for (const ssid of device.ssid_data) {
      const ssidInfo: SsidCircle = {
        name: `${ssid.ssid}/ssid/${uuid()}`,
        type: 'ssid',
        details: {
          ...ssid,
          avgRssi: '-',
          color: 'green',
          tagColor: 'green',
        },
        children: [],
        scale: 1,
      };

      let totalSsidRssi = 0;

      for (const association of ssid.associations) {
        const bw = association.tx_bytes_bw + association.rx_bytes_bw;
        globalBandwidth.push(bw);

        const associationInfo: AssociationCircle = {
          name: `${association.station}/assoc/${uuid()}`,
          type: 'association',
          details: {
            ...association,
            rssi: parseDbm(association.rssi) as '-' | number,
            color: 'green',
            tagColor: 'green',
          },
          scale: 1,
          totalBw: bw,
        };

        if (association.rssi >= -45) {
          associationInfo.details.color = successColor(colorMode);
          associationInfo.details.tagColor = 'green';
        } else if (association.rssi >= -60) {
          associationInfo.details.color = warningColor(colorMode);
          associationInfo.details.tagColor = 'yellow';
        } else {
          associationInfo.details.color = errorColor(colorMode);
          associationInfo.details.tagColor = 'red';
        }

        totalSsidRssi += association.rssi;
        ssidInfo.children.push(associationInfo);
      }

      const index = radioChannelIndex[ssid.band];
      if (index !== undefined) {
        ssidInfo.details.avgRssi =
          ssid.associations.length === 0
            ? '-'
            : parseDbm(Math.floor(totalSsidRssi / Math.max(ssid.associations.length, 1)));
        if (typeof ssidInfo.details.avgRssi === 'number') {
          if (ssid.associations.length === 0 || ssidInfo.details.avgRssi >= -45) {
            ssidInfo.details.color = successColor(colorMode);
            ssidInfo.details.tagColor = 'green';
          } else if (ssidInfo.details.avgRssi >= -60) {
            ssidInfo.details.color = warningColor(colorMode);
            ssidInfo.details.tagColor = 'yellow';
          }
        } else {
          ssidInfo.details.color = errorColor(colorMode);
          ssidInfo.details.tagColor = 'red';
        }

        deviceCircleInfo.children[index]?.children.push(ssidInfo);
      }
    }

    root.details.avgHealth = Math.floor(globalVenueHealth / Math.max(data.length, 1));
    if (root.details.avgHealth >= 90) {
      root.details.color = successColor(colorMode);
      root.details.tagColor = 'green';
    } else if (root.details.avgHealth >= 70) {
      root.details.color = warningColor(colorMode);
      root.details.tagColor = 'yellow';
    } else {
      root.details.color = errorColor(colorMode);
      root.details.tagColor = 'red';
    }
    root.children.push(deviceCircleInfo);
  }

  if (globalBandwidth.length > 0) {
    const scaledArray = getScaledArray(globalBandwidth, 1, 30);
    const bandwidthObj: { [key: number]: number } = {};
    for (const [i, bw] of globalBandwidth.entries()) {
      bandwidthObj[bw] = scaledArray[i];
    }

    for (const [deviceIndex, dev] of root.children.entries()) {
      for (const [radioIndex, radio] of dev.children.entries()) {
        for (const [ssidIndex, ssid] of radio.children.entries()) {
          for (const [assocIndex, assoc] of ssid.children.entries()) {
            if (root.children[deviceIndex]?.children[radioIndex]?.children[ssidIndex]?.children[assocIndex]?.scale)
              // @ts-ignore
              root.children[deviceIndex].children[radioIndex].children[ssidIndex].children[assocIndex].scale =
                bandwidthObj[assoc.totalBw];
          }
        }
      }
    }
  }
  return root;
};
