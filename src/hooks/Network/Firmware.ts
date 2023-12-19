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
    ({ keepRedirector, uri, signature }: { keepRedirector: boolean; uri: string; signature?: string }) =>
      axiosGw
        .post(`device/${serialNumber}/upgrade${signature ? `?FWsignature=${signature}` : ''}`, {
          serialNumber,
          when: 0,
          keepRedirector,
          uri,
          signature,
        })
        .then(
          (response) =>
            response as {
              data: {
                errorCode: number;
                errorText: string;
                status: string;
                results?: {
                  status?: {
                    error?: number;
                    resultCode?: number;
                    text?: string;
                  };
                };
              };
            },
        ),
    {
      onSuccess: ({ data }) => {
        if (data.errorCode === 0) {
          toast({
            id: `device-upgrade-success-${uuid()}`,
            title: t('common.success'),
            description: t('commands.firmware_upgrade_success'),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          onClose();
        } else if (data.errorCode === 1) {
          toast({
            id: `device-upgrade-warning-${uuid()}`,
            title: 'Warning',
            description: `${data?.errorText ?? 'Unknown Warning'}`,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          onClose();
        } else {
          toast({
            id: `device-upgrade-error-${uuid()}`,
            title: t('common.error'),
            description: `${data?.errorText ?? 'Unknown Error'} (Err. ${data.errorCode})`,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
      },
      onError: (e: AxiosError) => {
        toast({
          id: uuid(),
          title: t('common.error'),
          description: t('commands.firmware_upgrade_error', {
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
