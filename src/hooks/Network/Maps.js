import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetMaps = ({ t, toast }) =>
  useQuery(['get-maps'], () => axiosProv.get('/map').then(({ data }) => data.list), {
    staleTime: 60000,
    onError: (e) => {
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

export const useDeleteMap = ({ toast, t, goToMap }) =>
  useMutation((mapId) => axiosProv.delete(`map/${mapId}`, {}), {
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
    onError: (e) => {
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

export const useCreateMap = () => useMutation((map) => axiosProv.post(`map/0`, map));
export const useUpdateMap = ({ toast, t, mapId }) =>
  useMutation((map) => axiosProv.put(`map/${mapId}`, map), {
    onError: (e) => {
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
