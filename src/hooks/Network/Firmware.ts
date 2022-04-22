import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Firmware } from 'models/Firmware';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosFms, axiosGw } from 'utils/axiosInstances';
import { v4 as uuid } from 'uuid';

export const useGetAvailableFirmware = ({ deviceType }: { deviceType: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-device-profile'],
    () =>
      axiosFms
        .get(`firmwares?deviceType=${deviceType}&limit=10000&offset=0`)
        .then(({ data }: { data: { firmwares: Firmware[] } }) => data),
    {
      enabled: deviceType !== '',
      onError: (e: AxiosError) => {
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

export const useUpdateDeviceFirmware = ({ serialNumber, onClose }: { serialNumber: string; onClose: () => void }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(
    ({ keepRedirector, uri }: { keepRedirector: boolean; uri: string }) =>
      axiosGw.post(`device/${serialNumber}/upgrade`, { serialNumber, when: 0, keepRedirector, uri }),
    {
      onSuccess: () => {
        toast({
          id: `device-upgrade-success-${uuid()}`,
          title: t('common.success'),
          description: t('commands.upgrade_success'),
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
          description: t('commands.upgrade_error', {
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
