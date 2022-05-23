import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetMaps = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-maps'], () => axiosProv.get('/map').then(({ data }) => data.list), {
    staleTime: 60000,
    onError: (e: AxiosError) => {
      if (!toast.isActive('maps-fetching-error'))
        toast({
          id: 'maps-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('map.title'),
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

export const useDeleteMap = ({ goToMap }: { goToMap: () => void }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation((mapId) => axiosProv.delete(`map/${mapId}`, {}), {
    onSuccess: () => {
      toast({
        id: 'map-delete-success',
        title: t('common.success'),
        description: t('crud.success_delete_obj', {
          obj: t('map.title'),
        }),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      goToMap();
    },
    onError: (e: AxiosError) => {
      if (!toast.isActive('map-delete-error'))
        toast({
          id: 'map-delete-error',
          title: t('common.error'),
          description: t('crud.error_delete_obj', {
            obj: t('map.title'),
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

export const useCreateMap = () => useMutation((map) => axiosProv.post(`map/0`, map));
export const useUpdateMap = ({ mapId }: { mapId: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation((map) => axiosProv.put(`map/${mapId}`, map), {
    onError: (e: AxiosError) => {
      if (!toast.isActive('map-update-error'))
        toast({
          id: 'map-update-error',
          title: t('common.error'),
          description: t('crud.error_update_obj', {
            obj: t('map.title'),
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
