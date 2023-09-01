import { InventoryTagApiResponse } from 'models/Inventory';
import { axiosProv } from 'utils/axiosInstances';

export type ExportedDeviceInfo = {
  serialNumber: string;
  name: string;
  created: string;
  modified: string;
  description: string;
  devClass: string;
  deviceType: string;
  firmwareUpgrade: string;
  rcOnly: string;
  rrm: string;
  entity: string;
  venue: string;
  id: string;
  locale: string;
};

const getProvisioningInfo = (limit: number, offset: number) =>
  axiosProv
    .get(`inventory?withExtendedInfo=true&limit=${limit}&offset=${offset}`)
    .then((response) => response.data) as Promise<{ taglist: InventoryTagApiResponse[] }>;

const getAllProvisioningInfo = async (
  count: number,
  initialProgress: number,
  setProgress: (progress: number) => void,
) => {
  const progressStep = (90 - initialProgress) / Math.ceil(count / 100);
  let newProgress = initialProgress;
  let offset = 0;
  let devices: InventoryTagApiResponse[] = [];
  let devicesResponse: { taglist: InventoryTagApiResponse[] };
  do {
    // eslint-disable-next-line no-await-in-loop
    devicesResponse = await getProvisioningInfo(100, offset);
    devices = devices.concat(devicesResponse.taglist);
    setProgress((newProgress += progressStep));
    offset += 100;
  } while (devicesResponse.taglist.length === 100);

  return devices;
};

export const getAllExportedDevicesInfo = async (setProgress: (progress: number) => void) => {
  // Base Setup
  setProgress(0);
  const devicesCount = await axiosProv
    .get('inventory?countOnly=true')
    .then((response) => response.data.count as number);
  setProgress(10);

  if (devicesCount === 0) {
    setProgress(100);
    return [];
  }

  // Get Devices Info
  const devices = await getAllProvisioningInfo(devicesCount, 10, setProgress);

  setProgress(95);

  const unixToStr = (unixValue: number) => {
    try {
      return new Date(unixValue * 1000).toISOString();
    } catch (e) {
      return '';
    }
  };
  const exportedDevicesInfo: ExportedDeviceInfo[] = devices.map((device) => ({
    serialNumber: device.serialNumber,
    name: device.name,
    created: unixToStr(device.created),
    modified: unixToStr(device.modified),
    description: device.description,
    devClass: device.devClass,
    deviceType: device.deviceType,
    firmwareUpgrade: device.deviceRules.firmwareUpgrade,
    rcOnly: device.deviceRules.rcOnly,
    rrm: device.deviceRules.rrm,
    entity: device.extendedInfo?.entity?.name ?? '',
    venue: device.extendedInfo?.venue?.name ?? '',
    id: device.id,
    locale: device.locale,
  }));

  setProgress(100);
  return exportedDevicesInfo;
};

const getProvisioningInfoSelect = (serialNumbers: string[]) =>
  axiosProv
    .get(`inventory?withExtendedInfo=true&select=${serialNumbers.join(',')}`)
    .then((response) => response.data) as Promise<{ taglist: InventoryTagApiResponse[] }>;

export const getSelectExportedDevicesInfo = async (
  serialNumbers: string[],
  setProgress: (progress: number) => void,
) => {
  // Base Setup
  setProgress(0);
  const devicesCount = serialNumbers.length;
  setProgress(10);

  if (devicesCount === 0) {
    setProgress(100);
    return [];
  }

  // Get Devices Info
  const devices = (await getProvisioningInfoSelect(serialNumbers)).taglist;
  setProgress(95);

  const unixToStr = (unixValue: number) => {
    try {
      return new Date(unixValue * 1000).toISOString();
    } catch (e) {
      return '';
    }
  };
  const exportedDevicesInfo: ExportedDeviceInfo[] = devices.map((device) => ({
    serialNumber: device.serialNumber,
    name: device.name,
    created: unixToStr(device.created),
    modified: unixToStr(device.modified),
    description: device.description,
    devClass: device.devClass,
    deviceType: device.deviceType,
    firmwareUpgrade: device.deviceRules.firmwareUpgrade,
    rcOnly: device.deviceRules.rcOnly,
    rrm: device.deviceRules.rrm,
    entity: device.extendedInfo?.entity?.name ?? '',
    venue: device.extendedInfo?.venue?.name ?? '',
    id: device.id,
    locale: device.locale,
  }));

  setProgress(100);
  return exportedDevicesInfo;
};
