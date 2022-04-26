import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Device, EditDevice } from 'models/Device';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetSubscriberDevices = ({ operatorId, subscriberId }: { operatorId: string; subscriberId: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-subscriber-devices', operatorId, subscriberId],
    () =>
      !operatorId && !subscriberId
        ? []
        : axiosProv
            .get(
              `subscriberDevice?withExtendedInfo=true${operatorId ? `&operatorId=${operatorId}` : ''}${
                subscriberId ? `&subscriberId=${subscriberId}` : ''
              }`,
            )
            .then(({ data }: { data: { subscriberDevices: Device[] } }) => data.subscriberDevices),
    {
      onError: (e: AxiosError) => {
        if (!toast.isActive('subscriberDevices-fetching-error'))
          toast({
            id: 'subscriberDevices-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('devices.title'),
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

export const useGetSubscriberDevice = ({ enabled, id }: { enabled?: boolean; id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-subscriber-device', id],
    () => axiosProv.get(`subscriberDevice/${id}`).then(({ data }: { data: Device }) => data),
    {
      enabled,
      onError: (e: AxiosError) => {
        if (!toast.isActive('subscriberDevice-fetching-error'))
          toast({
            id: 'subscriberDevice-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('devices.title'),
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

export const useCreateSubscriberDevice = () =>
  useMutation((newSubscriberDevice: EditDevice) => axiosProv.post('subscriberDevice/0', newSubscriberDevice));

export const useUpdateSubscriberDevice = ({ id }: { id: string }) =>
  useMutation((newSubscriberDevice: EditDevice) => axiosProv.put(`subscriberDevice/${id}`, newSubscriberDevice));

export const useDeleteSubscriberDevice = ({ id }: { id: string }) =>
  useMutation(() => axiosProv.delete(`subscriberDevice/${id}`, {}));
