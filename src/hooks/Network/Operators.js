import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetOperatorCount = ({ t, toast, enabled }) =>
  useQuery(['get-operator-count'], () => axiosProv.get(`operators?countOnly=true`).then(({ data }) => data.count), {
    enabled,
    onError: (e) => {
      if (!toast.isActive('operator-fetching-error'))
        toast({
          id: 'operator-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('operator.other'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });

export const useGetOperators = ({ t, toast, pageInfo, select, enabled, count }) => {
  if (select !== undefined && select !== null) {
    return useQuery(
      ['get-operators-with-select', select],
      () =>
        select.length > 0
          ? axiosProv.get(`operators?withExtendedInfo=true&select=${select}`).then(({ data }) => data.operators)
          : [],
      {
        enabled,
        staleTime: 30000,
        keepPreviousData: true,
        onError: (e) => {
          if (!toast.isActive('get-operator-fetching-error'))
            toast({
              id: 'get-operator-fetching-error',
              title: t('common.error'),
              description: t('crud.error_fetching_obj', {
                obj: t('operator.other'),
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
    ['get-operators-with-pagination', pageInfo, count],
    () =>
      axiosProv
        .get(
          `operators?withExtendedInfo=true&limit=${pageInfo?.limit ?? 10}&offset=${
            (pageInfo?.limit ?? 10) * (pageInfo?.index ?? 1)
          }`,
        )
        .then(({ data }) => data.operators),
    {
      keepPreviousData: true,
      enabled,
      staleTime: 30000,
      onError: (e) => {
        if (!toast.isActive('get-operators-fetching-error'))
          toast({
            id: 'get-operators-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('operator.other'),
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

export const useGetOperator = ({ t, toast, enabled, id }) =>
  useQuery(['get-operator', id], () => axiosProv.get(`operators/${id}`).then(({ data }) => data), {
    enabled,
    onError: (e) => {
      if (!toast.isActive('opeator-fetching-error'))
        toast({
          id: 'operator-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('operator.one'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });

export const useCreateOperator = () => useMutation((newOperator) => axiosProv.post(`operators/1`, newOperator));

export const useUpdateOperator = ({ id }) =>
  useMutation((newOperator) => axiosProv.put(`operators/${id}`, newOperator));

export const useDeleteOperator = ({ id }) => useMutation(() => axiosProv.delete(`operators/${id}`));
