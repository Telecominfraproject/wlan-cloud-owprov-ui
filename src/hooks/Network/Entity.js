import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetEntities = ({ t, toast }) =>
  useQuery(
    ['get-entities'],
    () => axiosProv.get('entity?withExtendedInfo=true&offset=0&limit=500').then(({ data }) => data.entities),
    {
      staleTime: 30000,
      onError: (e) => {
        if (!toast.isActive('entities-fetching-error'))
          toast({
            id: 'entities-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('entities.title'),
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

export const useGetSelectEntities = ({ t, toast, select }) =>
  useQuery(
    ['get-entities', select],
    () =>
      select.length === 0
        ? []
        : axiosProv.get(`entity?withExtendedInfo=true&select=${select}`).then(({ data }) => data.entities),
    {
      staleTime: 100 * 1000,
      onError: (e) => {
        if (!toast.isActive('entities-fetching-error'))
          toast({
            id: 'entities-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('entities.title'),
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

export const useGetEntity = ({ t, toast, id = null }) =>
  useQuery(['get-entity', id], () => axiosProv.get(`entity/${id}?withExtendedInfo=true`).then(({ data }) => data), {
    enabled: id !== null,
    onError: (e) => {
      if (!toast.isActive('entity-fetching-error'))
        toast({
          id: 'entity-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('entities.one'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });

export const useGetRoot = ({ openModal }) =>
  useQuery(['get-root'], () => axiosProv.get(`entity/0000-0000-0000`).then(() => true), {
    enabled: false,
    onError: (error) => {
      if (error?.response?.status === 404) openModal();
    },
  });

export const useCreateEntity = (isRoot = false) =>
  useMutation((newEnt) => axiosProv.post(`entity/${isRoot ? '0000-0000-0000' : 0}`, newEnt));

export const useUpdateEntity = ({ id }) => useMutation((newEnt) => axiosProv.put(`entity/${id}`, newEnt));

export const useDeleteEntity = () => useMutation((id) => axiosProv.delete(`entity/${id}`));
