import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetSubscriberDevices = ({ t, toast, operatorId }) =>
  useQuery(
    ['get-subscriber-devices', operatorId],
    () =>
      !operatorId
        ? []
        : axiosProv
            .get(`subscriberDevice?withExtendedInfo=true&operatorId=${operatorId}`)
            .then(({ data }) => data.subscriberDevices),
    {
      onError: (e) => {
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

export const useGetSubscriberDevice = ({ enabled, id }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-subscriber-device', id],
    () => axiosProv.get(`subscriberDevice/${id}`).then(({ data }) => data),
    {
      enabled,
      onError: (e) => {
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
  useMutation((newSubscriberDevice) => axiosProv.post('subscriberDevice/0', newSubscriberDevice));

export const useUpdateSubscriberDevice = ({ id }) =>
  useMutation((newSubscriberDevice) => axiosProv.put(`subscriberDevice/${id}`, newSubscriberDevice));

export const useDeleteSubscriberDevice = ({ id }) => useMutation(() => axiosProv.delete(`subscriberDevice/${id}`, {}));
