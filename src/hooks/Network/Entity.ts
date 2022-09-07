import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import useDefaultPage from 'hooks/useDefaultPage';
import { Entity } from 'models/Entity';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv, axiosSec } from 'utils/axiosInstances';

export const useGetEntityTree = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-entity-tree'], () => axiosProv.get('entity?getTree=true').then(({ data }) => data), {
    enabled: axiosProv.defaults.baseURL !== axiosSec.defaults.baseURL,
    staleTime: Infinity,
    keepPreviousData: true,
    onError: (e: AxiosError) => {
      if (!toast.isActive('entity-tree-fetching-error'))
        toast({
          id: 'entity-tree-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('entities.tree'),
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

export const useGetEntities = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-entities'],
    () =>
      axiosProv
        .get('entity?withExtendedInfo=true&offset=0&limit=500')
        .then(({ data }: { data: { entities: Entity[] } }) => data.entities),
    {
      staleTime: 30000,
      onError: (e: AxiosError) => {
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
};

export const useGetSelectEntities = ({ select }: { select: string[] }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-entities', select],
    () =>
      select.length === 0
        ? []
        : axiosProv.get(`entity?withExtendedInfo=true&select=${select}`).then(({ data }) => data.entities),
    {
      staleTime: 100 * 1000,
      onError: (e: AxiosError) => {
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
};

export const useGetEntity = ({ id }: { id?: string }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const goToDefaultPage = useDefaultPage();

  return useQuery(
    ['get-entity', id],
    () => axiosProv.get(`entity/${id}?withExtendedInfo=true`).then(({ data }) => data as Entity),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
      enabled: id !== undefined && id !== null && id !== '',
      onError: (e: AxiosError) => {
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
        goToDefaultPage();
      },
    },
  );
};

export const useGetRoot = ({ openModal }: { openModal: () => void }) =>
  useQuery(['get-root'], () => axiosProv.get(`entity/0000-0000-0000`).then(() => true), {
    enabled: false,
    onError: (e: AxiosError) => {
      if (e?.response?.status === 404) openModal();
    },
  });

export const useCreateEntity = (isRoot = false) =>
  useMutation((newEnt) =>
    axiosProv.post(`entity/${isRoot ? '0000-0000-0000' : 0}`, newEnt).then(({ data }) => data as Entity),
  );

export const useUpdateEntity = ({ id }: { id: string }) =>
  useMutation((newEnt) => axiosProv.put(`entity/${id}`, newEnt).then(({ data }) => data as Entity));

export const useDeleteEntity = () => useMutation((id: string) => axiosProv.delete(`entity/${id}`));
