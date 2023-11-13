import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Entity } from '../../models/Entity';
import { AxiosError } from 'models/Axios';
import { axiosProv, axiosSec } from 'utils/axiosInstances';

export type TreeVenue = {
  name: string;
  uuid: string;
  type: 'venue';
  children: TreeVenue[];
  venues?: undefined;
};

export type TreeEntity = {
  name: string;
  uuid: string;
  type: 'entity';
  children: TreeEntity[];
  venues: TreeVenue[];
};

// Traverse the tree and add a description
export const filterEmptyObjects = (tree: TreeEntity | TreeVenue): TreeEntity | TreeVenue => {
  const newTree = { ...tree };
  newTree.children = tree.children.filter((child) => child.uuid !== undefined && child.name !== undefined) as
    | TreeEntity[]
    | TreeVenue[];
  newTree.venues = tree.venues?.filter((venue) => venue.uuid !== undefined && venue.name !== undefined) as TreeVenue[];
  if (newTree.children)
    newTree.children = newTree.children.map((child) => filterEmptyObjects(child)) as TreeEntity[] | TreeVenue[];
  if (newTree.venues) newTree.venues = newTree.venues.map((v) => filterEmptyObjects(v)) as TreeVenue[];
  return newTree;
};

export const useGetEntityTree = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-entity-tree'],
    () => axiosProv.get('entity?getTree=true').then(({ data }) => filterEmptyObjects(data) as TreeEntity),
    {
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
    },
  );
};

const getEntitiesBatch = async (limit: number, offset: number) =>
  axiosProv
    .get(`entity?withExtendedInfo=true&offset=${offset}&limit=${limit}`)
    .then(({ data }: { data: { entities: Entity[] } }) => data.entities);

const getAllEntities = async () => {
  const limit = 500;
  let offset = 0;
  let data: Entity[] = [];
  let lastResponse: Entity[] = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    lastResponse = await getEntitiesBatch(limit, offset);
    data = data.concat(lastResponse);
    offset += limit;
  } while (lastResponse.length === limit);
  return data;
};

export const useGetEntities = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-entities'], () => getAllEntities(), {
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
  });
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

  return useQuery(
    ['get-entity', id],
    () => axiosProv.get(`entity/${id}?withExtendedInfo=true`).then(({ data }) => data as Entity),
    {
      keepPreviousData: true,
      staleTime: 1000 * 5,
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

export const useUpdateEntity = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  return useMutation(
    (newEnt: Partial<Entity>) => axiosProv.put(`entity/${id}`, newEnt).then(({ data }) => data as Entity),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['get-entity-tree']);
        queryClient.invalidateQueries(['get-entities']);
        queryClient.setQueryData(['get-entity', id], data);
      },
    },
  );
};

export const useDeleteEntity = () => useMutation((id: string) => axiosProv.delete(`entity/${id}`));
