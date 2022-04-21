import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { GatewayDevice, WifiScanCommand, WifiScanResult } from 'models/Device';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosGw } from 'utils/axiosInstances';

export const useGetDevice = ({ serialNumber }: { serialNumber: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-gateway-device', serialNumber],
    () => axiosGw.get(`device/${serialNumber}`).then(({ data }: { data: GatewayDevice }) => data),
    {
      enabled: serialNumber !== '',
      onError: (e: AxiosError) => {
        if (!toast.isActive('gateway-device-fetching-error'))
          toast({
            id: 'gateway-device-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              e: e?.response?.data?.ErrorDescription,
              obj: t('devices.one'),
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
      },
    },
  );
};

export const useRebootDevice = ({ serialNumber }: { serialNumber: string }) =>
  useMutation(() => axiosGw.post(`device/${serialNumber}/reboot`, { serialNumber, when: 0 }));

export const useBlinkDevice = ({ serialNumber }: { serialNumber: string }) =>
  useMutation(() =>
    axiosGw.post(`device/${serialNumber}/leds`, { serialNumber, when: 0, pattern: 'blink', duration: 30 }),
  );
export const useFactoryReset = ({ serialNumber, keepRedirector }: { serialNumber: string; keepRedirector: boolean }) =>
  useMutation(() => axiosGw.post(`device/${serialNumber}/factory`, { serialNumber, keepRedirector }));

export const useWifiScanDevice = ({ serialNumber }: { serialNumber: string }) =>
  useMutation(
    ({ dfs, bandwidth, activeScan }: WifiScanCommand): Promise<WifiScanResult | undefined> =>
      axiosGw
        .post<WifiScanResult>(`device/${serialNumber}/wifiscan`, {
          serialNumber,
          override_dfs: dfs,
          bandwidth: bandwidth !== '' ? bandwidth : undefined,
          activeScan,
        })
        .then(({ data }: { data: WifiScanResult }) => data),
  );
