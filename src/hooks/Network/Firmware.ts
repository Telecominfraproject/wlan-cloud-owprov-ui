import { useToast } from '@chakra-ui/react';
import { Device } from 'models/Device';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosFms, axiosGw } from 'utils/axiosInstances';

export const useGetAvailableFirmware = ({ deviceType }: { deviceType: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-device-profile'],
    () =>
      axiosFms
        .get(`firmwares?deviceType=${deviceType}&limit=10000&offset=0`)
        .then(({ data }: { data: Device }) => data),
    {
      enabled: deviceType !== '',
      onError: (e: any) => {
        if (!toast.isActive('firmware-fetching-error'))
          toast({
            id: 'firmware-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              e: e?.response?.data?.ErrorDescription,
              obj: t('analytics.firmware'),
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

export const useUpdateDeviceFirmware = ({ serialNumber }: { serialNumber: string }) =>
  useMutation(({ keepRedirector, uri }: { keepRedirector: boolean; uri: string }) =>
    axiosGw.post(`device/${serialNumber}/upgrade`, { serialNumber, when: 0, keepRedirector, uri }),
  );
