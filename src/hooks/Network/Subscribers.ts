import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { EditingSubscriber, Subscriber } from 'models/Subscriber';
import { PageInfo } from 'models/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';
import { v4 as uuid } from 'uuid';

export const useGetSubscriberCount = ({ enabled, operatorId }: { enabled: boolean; operatorId: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-subscriber-count'],
    () =>
      axiosSec
        .get(`subusers?countOnly=true${operatorId ? `&operatorId=${operatorId}` : ''}`)
        .then(({ data }: { data: { count: number } }) => data.count),
    {
      enabled,
      onError: (e: AxiosError) => {
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

export const useGetSubscribers = ({
  pageInfo,
  select,
  enabled,
  count,
  operatorId,
}: {
  pageInfo?: PageInfo;
  select?: string[];
  enabled?: boolean;
  count?: number;
  operatorId?: string;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  if (select !== undefined && select !== null) {
    return useQuery(
      ['get-subscribers-with-select', select],
      () =>
        select.length > 0
          ? axiosSec
              .get(`subusers?withExtendedInfo=true&select=${select}${operatorId ? `&operatorId=${operatorId}` : ''}`)
              .then(({ data }: { data: { users: Subscriber[] } }) => data.users)
          : [],
      {
        enabled,
        staleTime: 30000,
        keepPreviousData: true,
        onError: (e: AxiosError) => {
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
            }${operatorId ? `&operatorId=${operatorId}` : ''}`,
          )
          .then(({ data }: { data: { users: Subscriber[] } }) => data.users),
      {
        keepPreviousData: true,
        enabled,
        staleTime: 30000,
        onError: (e: AxiosError) => {
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

  return useQuery(
    ['get-all-subscribers'],
    () =>
      axiosSec
        .get(`subusers?limit=500${operatorId ? `&operatorId=${operatorId}` : ''}`)
        .then(({ data }: { data: { users: Subscriber[] } }) => data.users),
    {
      keepPreviousData: true,
      enabled,
      staleTime: 30000,
      onError: (e: AxiosError) => {
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
};

export const useGetSubscriber = ({ id, enabled }: { id: string; enabled?: boolean }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-subscriber', id],
    () => axiosSec.get(`subuser/${id}?withExtendedInfo=true`).then(({ data }: { data: Subscriber }) => data),
    {
      enabled,
      onError: (e: AxiosError) => {
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

export const useCreateSubscriber = () =>
  useMutation((newSubscriber: EditingSubscriber) =>
    axiosSec.post(`subuser/0${newSubscriber.emailValidation ? '?email_verification=true' : ''}`, newSubscriber),
  );

export const useUpdateSubscriber = ({ id }: { id: string }) =>
  useMutation((newSubscriber: EditingSubscriber) => axiosSec.put(`subuser/${id}`, newSubscriber));

export const useSuspendSubscriber = ({ id }: { id: string }) =>
  useMutation((isSuspended: boolean) =>
    axiosSec.put(`subuser/${id}`, {
      suspended: isSuspended,
    }),
  );

export const useSendEmailResetSubscriber = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(() => axiosSec.put(`subuser/${id}?resetPassword=true`, {}), {
    onSuccess: () => {
      toast({
        id: `subscriber-reset-password-success-${uuid()}`,
        title: t('common.success'),
        description: t('users.reset_password_success'),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (e: AxiosError) => {
      toast({
        id: 'subscriber-reset-password-error',
        title: t('common.error'),
        description: t('users.reset_password_error', {
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

export const useDeleteSubscriber = ({ id }: { id: string }) => useMutation(() => axiosSec.delete(`subuser/${id}`, {}));

export const useSendSubscriberEmailValidation = ({ id, refresh }: { id: string; refresh: () => void }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation(() => axiosSec.put(`subuser/${id}?email_verification=true`, {}), {
    onSuccess: () => {
      toast({
        id: `user-validation-email-success`,
        title: t('common.success'),
        description: t('users.success_sending_validation'),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      refresh();
    },
    onError: (e: AxiosError) => {
      toast({
        id: `user-validation-email-error`,
        title: t('common.error'),
        description: t('users.error_sending_validation', {
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
