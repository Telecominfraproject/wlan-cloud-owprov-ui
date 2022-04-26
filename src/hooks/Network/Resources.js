import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetResourcesCount = ({ t, toast }) =>
  useQuery(['get-resources-count'], () => axiosProv.get(`variable?countOnly=true`).then(({ data }) => data.count), {
    onError: (e) => {
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
  });

export const useGetAllResources = ({ t, toast }) =>
  useQuery(['get-all-resources'], () => axiosProv.get(`variable?limit=500`).then(({ data }) => data.variableBlocks), {
    onError: (e) => {
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

export const useGetResources = ({ t, toast, pageInfo, select, count }) => {
  if (select !== undefined && select !== null) {
    return useQuery(
      ['get-resources-with-select', select],
      () =>
        select.length > 0
          ? axiosProv.get(`variable?withExtendedInfo=true&select=${select}`).then(({ data }) => data.variableBlocks)
          : [],
      {
        keepPreviousData: true,
        onError: (e) => {
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
      onError: (e) => {
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

export const useGetResource = ({ t, toast, id, enabled }) =>
  useQuery(['get-resource', id], () => axiosProv.get(`variable/${id}?withExtendedInfo=true`).then(({ data }) => data), {
    enabled,
    onError: (e) => {
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

export const useCreateResource = () => useMutation((newResource) => axiosProv.post('variable/0', newResource));
export const useUpdateResource = (id) => useMutation((resource) => axiosProv.put(`variable/${id}`, resource));
export const useDeleteResource = () => useMutation((id) => axiosProv.delete(`variable/${id}`, {}));
