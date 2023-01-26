import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'models/Axios';
import { PageInfo } from 'models/Table';
import { VariableBlock } from 'models/VariableBlock';
import { axiosProv } from 'utils/axiosInstances';

export const useGetResourcesCount = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-resources-count'],
    () => axiosProv.get(`variable?countOnly=true`).then(({ data }) => data.count),
    {
      onError: (e: AxiosError) => {
        if (!toast.isActive('variables-fetching-error'))
          toast({
            id: 'variables-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('resources.title'),
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

const getResourceBatch = async (limit: number, offset: number) =>
  axiosProv.get(`variable?limit=${limit}&offset=${offset}`).then(({ data }) => data.variableBlocks as unknown[]);

const getAllResources = async () => {
  const limit = 500;
  let offset = 0;
  let data: unknown[] = [];
  let lastResponse: unknown[] = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    lastResponse = await getResourceBatch(limit, offset);
    data = data.concat(lastResponse);
    offset += limit;
  } while (lastResponse.length === limit);
  return data;
};

export const useGetAllResources = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-all-resources'], () => getAllResources(), {
    onError: (e: AxiosError) => {
      if (!toast.isActive('resource-fetching-error'))
        toast({
          id: 'resource-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('resources.configuration_resource'),
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

export const useGetResources = ({
  pageInfo,
  select,
  count,
}: {
  pageInfo?: PageInfo;
  select?: string[];
  count?: number;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  if (select !== undefined && select !== null) {
    return useQuery(
      ['get-resources-with-select', select],
      () =>
        select.length > 0
          ? axiosProv
              .get(`variable?withExtendedInfo=true&select=${select}`)
              .then(({ data }: { data: { variableBlocks: VariableBlock[] } }) => data.variableBlocks)
          : [],
      {
        onError: (e: AxiosError) => {
          if (!toast.isActive('get-resources-fetching-error'))
            toast({
              id: 'get-resources-fetching-error',
              title: t('common.error'),
              description: t('crud.error_fetching_obj', {
                obj: t('resources.title'),
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
  }

  return useQuery(
    ['get-resources-with-pagination', pageInfo, count],
    () =>
      axiosProv
        .get(
          `variable?withExtendedInfo=true&limit=${pageInfo?.limit ?? 10}&offset=${
            (pageInfo?.limit ?? 10) * (pageInfo?.index ?? 1)
          }`,
        )
        .then(({ data }) => data.variableBlocks),
    {
      keepPreviousData: true,
      enabled: pageInfo !== null,
      onError: (e: AxiosError) => {
        if (!toast.isActive('get-resources-fetching-error'))
          toast({
            id: 'get-resources-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('resources.title'),
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

export const useGetResource = ({ id, enabled }: { id: string; enabled: boolean }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-resource', id],
    () => axiosProv.get(`variable/${id}?withExtendedInfo=true`).then(({ data }) => data),
    {
      enabled,
      onError: (e: AxiosError) => {
        if (!toast.isActive('resource-fetching-error'))
          toast({
            id: 'resource-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('resources.configuration_resource'),
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

export const useCreateResource = () => useMutation((newResource: unknown) => axiosProv.post('variable/0', newResource));
export const useUpdateResource = (id: string) =>
  useMutation((resource: unknown) => axiosProv.put(`variable/${id}`, resource));
export const useDeleteResource = () => useMutation((id) => axiosProv.delete(`variable/${id}`, {}));
