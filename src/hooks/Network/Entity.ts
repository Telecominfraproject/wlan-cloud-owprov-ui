import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import useDefaultPage from 'hooks/useDefaultPage';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetEntities = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-entities'],
    () => axiosProv.get('entity?withExtendedInfo=true&offset=0&limit=500').then(({ data }) => data.entities),
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

export const useGetEntity = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const goToDefaultPage = useDefaultPage();

  return useQuery(
    ['get-entity', id],
    () => axiosProv.get(`entity/${id}?withExtendedInfo=true`).then(({ data }) => data),
    {
      enabled: id !== null,
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
  useMutation((newEnt) => axiosProv.post(`entity/${isRoot ? '0000-0000-0000' : 0}`, newEnt));

export const useUpdateEntity = ({ id }: { id: string }) =>
  useMutation((newEnt) => axiosProv.put(`entity/${id}`, newEnt));

export const useDeleteEntity = () => useMutation((id: string) => axiosProv.delete(`entity/${id}`));
