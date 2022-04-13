import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';

export const useGetSubscriberCount = ({ enabled }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-subscriber-count'],
    () => axiosSec.get(`subusers?countOnly=true`).then(({ data }) => data.count),
    {
      enabled,
      onError: (e) => {
        if (!toast.isActive('subscriber-fetching-error'))
          toast({
            id: 'subscriber-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('subscribers.other'),
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

export const useGetSubscribers = ({ pageInfo, select, enabled, count }) => {
  const { t } = useTranslation();
  const toast = useToast();

  if (select !== undefined && select !== null) {
    return useQuery(
      ['get-subscribers-with-select', select],
      () =>
        select.length > 0
          ? axiosSec.get(`subusers?withExtendedInfo=true&select=${select}`).then(({ data }) => data.users)
          : [],
      {
        enabled,
        staleTime: 30000,
        keepPreviousData: true,
        onError: (e) => {
          if (!toast.isActive('get-subscriber-fetching-error'))
            toast({
              id: 'get-subscriber-fetching-error',
              title: t('common.error'),
              description: t('crud.error_fetching_obj', {
                obj: t('subscribers.other'),
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

  if (pageInfo !== undefined && pageInfo !== null) {
    return useQuery(
      ['get-subscribers-with-pagination', pageInfo, count],
      () =>
        axiosSec
          .get(
            `subusers?withExtendedInfo=true&limit=${pageInfo?.limit ?? 10}&offset=${
              (pageInfo?.limit ?? 10) * (pageInfo?.index ?? 1)
            }`,
          )
          .then(({ data }) => data.users),
      {
        keepPreviousData: true,
        enabled,
        staleTime: 30000,
        onError: (e) => {
          if (!toast.isActive('get-subscribers-fetching-error'))
            toast({
              id: 'get-subscribers-fetching-error',
              title: t('common.error'),
              description: t('crud.error_fetching_obj', {
                obj: t('subscribers.other'),
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

  return useQuery(['get-all-subscribers'], () => axiosSec.get(`subusers?limit=500`).then(({ data }) => data.users), {
    keepPreviousData: true,
    enabled,
    staleTime: 30000,
    onError: (e) => {
      if (!toast.isActive('get-subscribers-fetching-error'))
        toast({
          id: 'get-subscribers-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('subscribers.other'),
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

export const useGetSubscriber = ({ id, enabled }) => {
  const { t } = useToast();
  const toast = useToast();

  return useQuery(
    ['get-subscriber', id],
    () => axiosSec.get(`subuser/${id}?withExtendedInfo=true`).then(({ data }) => data),
    {
      enabled,
      onError: (e) => {
        if (!toast.isActive('subscriber-fetching-error'))
          toast({
            id: 'subscriber-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('subscribers.one'),
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

export const useCreateSubscriber = () => useMutation((newSubscriber) => axiosSec.post('subuser/0', newSubscriber));

export const useUpdateSubscriber = ({ id }) =>
  useMutation((newSubscriber) => axiosSec.put(`subuser/${id}`, newSubscriber));

export const useSuspendSubscriber = ({ id }) =>
  useMutation((isSuspended) =>
    axiosSec.put(`subuser/${id}`, {
      suspended: isSuspended,
    }),
  );

export const useDeleteSubscriber = ({ id }) => useMutation(() => axiosSec.delete(`subuser/${id}`, {}));
