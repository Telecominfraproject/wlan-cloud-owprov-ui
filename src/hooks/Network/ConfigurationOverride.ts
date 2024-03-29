import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'models/Axios';
import { axiosProv } from 'utils/axiosInstances';

const CHANNELS = {
  '2G': [1, 6, 11],
  '5G': {
    40: [36, 44, 52, 60, 100, 108, 116, 124, 132, 149, 157, 165, 173, 184, 192],
    80: [36, 52, 100, 116, 132, 149],
  },
  '5G-lower': {
    20: [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144],
    40: [38, 46, 54, 63, 102, 110, 118, 126, 134, 142],
    80: [42, 58, 106, 122, 138],
    160: [50, 114],
  },
  '5G-upper': {
    20: [149, 153, 157, 161, 165],
    40: [151, 159],
    80: [155],
  },
  '6G': {
    20: [
      1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69, 73, 77, 81, 85, 89, 93, 97, 101, 105, 109,
      113, 117, 121, 125, 129, 133, 137, 141, 145, 149, 153, 157, 161, 165, 169, 173, 177, 181, 185, 189, 193, 197, 201,
      205, 209, 213, 217, 221, 225, 229, 233,
    ],
    40: [
      3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 123, 131, 139, 147, 155, 163, 171, 17, 187, 195, 203,
      211, 219, 227,
    ],
    80: [7, 23, 39, 55, 71, 87, 103, 119, 135, 151, 167, 183, 199, 215],
    160: [15, 47, 79, 143],
  },
};

const channelsToArr = () => {
  const res: { value: string; label: string }[] = [];

  for (const [, channels] of Object.entries(CHANNELS)) {
    if (Array.isArray(channels)) {
      for (const channel of channels) {
        const channelStr = channel.toString();
        if (!res.find((item) => item.value === channelStr)) {
          res.push({ value: channelStr, label: channelStr });
        }
      }
    } else {
      for (const [, nestedChannels] of Object.entries(channels)) {
        for (const channel of nestedChannels) {
          const channelStr = channel.toString();
          if (!res.find((item) => item.value === channelStr)) {
            res.push({ value: channelStr, label: channelStr });
          }
        }
      }
    }
  }

  return res.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
};

export const ACCEPTED_CONFIGURATION_OVERRIDES = {
  radios: {
    channel: {
      name: 'channel',
      label: 'overrides.channel',
      type: 'select',
      defaultValue: 'auto',
      options: [{ value: 'auto', label: 'Auto' }, ...channelsToArr()],
      test: () => undefined,
    },
    'tx-power': {
      name: 'tx-power',
      label: 'overrides.tx_power',
      type: 'integer',
      defaultValue: 10,
      test: (v: number) => (v < 1 || v > 32 ? 'overrides.tx_power_error' : undefined),
    },
  },
};

export type ConfigurationOverride = {
  source: string;
  reason: string;
  parameterName: string;
  parameterType: 'string' | 'integer' | 'boolean';
  parameterValue: string;
  modified?: number;
};

export type ConfigurationOverrideResponse = {
  serialNumber: string;
  managementPolicy: string;
  overrides: ConfigurationOverride[];
};

export type ConfigurationOverridesRequest = {
  serialNumber: string;
  managementPolicy?: string;
  overrides: ConfigurationOverride[];
};

const getOverrides = async (serialNumber?: string) =>
  axiosProv
    .get(`configurationOverrides/${serialNumber}`)
    .then(({ data }: { data: ConfigurationOverrideResponse }) => data)
    .catch((e: AxiosError) => {
      if (e.response?.status === 404) {
        return {
          serialNumber,
          managementPolicy: '',
          overrides: [],
        } as ConfigurationOverrideResponse;
      }
      throw e;
    });

export const useGetDeviceConfigurationOverrides = ({ serialNumber }: { serialNumber?: string }) =>
  useQuery(['configurationOverrides', serialNumber], () => getOverrides(serialNumber), {
    enabled: serialNumber !== undefined && serialNumber !== '',
    staleTime: 1000 * 60 * 30000,
  });

const deleteOverrides = async ({ serialNumber, source }: { serialNumber: string; source: string }) =>
  axiosProv.delete(`configurationOverrides/${serialNumber}?source=${source}`, {});
export const useDeleteOverrideSource = () => useMutation(deleteOverrides);

const modifySourceOverrides = async ({ data, source }: { data: ConfigurationOverridesRequest; source: string }) =>
  axiosProv.put(`configurationOverrides/${data.serialNumber}?source=${source}`, data);
export const useUpdateSourceOverrides = () => useMutation(modifySourceOverrides);
