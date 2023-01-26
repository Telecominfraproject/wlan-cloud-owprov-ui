import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { AxiosError } from 'models/Axios';
import { Firmware } from 'models/Firmware';
import { axiosFms, axiosGw } from 'utils/axiosInstances';

const getAvailableFirmwareBatch = async (deviceType: string, limit: number, offset: number) =>
  axiosFms
    .get(`firmwares?deviceType=${deviceType}&limit=${limit}&offset=${offset}`)
    .then(({ data }: { data: { firmwares: Firmware[] } }) => data);

const getAllAvailableFirmware = async (deviceType: string) => {
  const limit = 500;
  let offset = 0;
  let data: { firmwares: Firmware[] } = { firmwares: [] };
  let lastResponse: { firmwares: Firmware[] } = { firmwares: [] };
  do {
    // eslint-disable-next-line no-await-in-loop
    lastResponse = await getAvailableFirmwareBatch(deviceType, limit, offset);
    data = {
      firmwares: [...data.firmwares, ...lastResponse.firmwares],
    };
    offset += 500;
  } while (lastResponse.firmwares.length === 500);
  return data;
};

export const useGetAvailableFirmware = ({ deviceType }: { deviceType: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['firmware'], () => getAllAvailableFirmware(deviceType), {
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
  });
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
