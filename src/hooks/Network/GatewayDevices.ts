import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosGw } from 'utils/axiosInstances';
import { v4 as uuid } from 'uuid';
import { DeviceRttyApiResponse, GatewayDevice, WifiScanCommand, WifiScanResult } from '../../models/Device';

export const useGetDevice = ({ serialNumber, onClose }: { serialNumber: string; onClose?: () => void }) => {
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
            description:
              e?.response?.status === 404
                ? t('devices.not_found_gateway')
                : t('crud.error_fetching_obj', {
                    e: e?.response?.data?.ErrorDescription,
                    obj: t('devices.one'),
                  }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        if (onClose) onClose();
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
export const useFactoryReset = ({
  serialNumber,
  keepRedirector,
  onClose,
}: {
  serialNumber: string;
  keepRedirector: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(() => axiosGw.post(`device/${serialNumber}/factory`, { serialNumber, keepRedirector }), {
    onSuccess: () => {
      toast({
        id: `factory-reset-success-${uuid()}`,
        title: t('common.success'),
        description: t('commands.factory_reset_success'),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onClose();
    },
    onError: (e: AxiosError) => {
      toast({
        id: uuid(),
        title: t('common.error'),
        description: t('commands.factory_reset_error', {
          e: e?.response?.data?.ErrorDescription,
        }),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });
};

export const useWifiScanDevice = ({ serialNumber }: { serialNumber: string }) => {
  const toast = useToast();
  const { t } = useTranslation();

  return useMutation(
    ({ dfs, bandwidth, activeScan }: WifiScanCommand): Promise<WifiScanResult | undefined> =>
      axiosGw
        .post<WifiScanResult>(`device/${serialNumber}/wifiscan`, {
          serialNumber,
          override_dfs: dfs,
          bandwidth: bandwidth !== '' ? bandwidth : undefined,
          activeScan,
        })
        .then(({ data }: { data: WifiScanResult }) => data),
    {
      onSuccess: () => {},
      onError: (e: AxiosError) => {
        toast({
          id: uuid(),
          title: t('common.error'),
          description: t('commands.wifiscan_error', {
            e: e?.response?.data?.ErrorDescription,
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

export const useGetDeviceRtty = ({ serialNumber, extraId }: { serialNumber: string; extraId: string | number }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-gateway-device-rtty', serialNumber, extraId],
    () => axiosGw.get(`device/${serialNumber}/rtty`).then(({ data }: { data: DeviceRttyApiResponse }) => data),
    {
      enabled: false,
      onSuccess: ({ server, viewport, connectionId }) => {
        const url = `https://${server}:${viewport}/connect/${connectionId}`;
        window.open(url, '_blank')?.focus();
      },
      onError: (e: AxiosError) => {
        if (!toast.isActive('get-gateway-device-rtty-error'))
          toast({
            id: 'get-gateway-device-rtty',
            title: t('common.error'),
            description:
              e?.response?.status === 404
                ? t('devices.not_found_gateway')
                : t('devices.error_rtty', {
                    e: e?.response?.data?.ErrorDescription,
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
