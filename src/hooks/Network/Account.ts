import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Preference } from 'models/Preference';
import { User } from 'models/User';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';

export const useUpdatePreferences = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  return useMutation((newPreferences: Preference[]) => axiosSec.put(`preferences`, { data: newPreferences }), {
    onSuccess: ({ data: { data: preferences } }: { data: { data: Preference[] } }) => {
      queryClient.setQueryData(['get-preferences', id], preferences);
    },
  });
};

export const useGetPreferences = ({ enabled }: { enabled?: boolean }) =>
  useQuery(
    ['get-user-preferences'],
    () =>
      axiosSec
        .get('preferences')
        .then(({ data: { data: preferences } }: { data: { data: Preference[] } }) => preferences),
    {
      enabled,
    },
  );

export const useGetProfile = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-user-profile'], () => axiosSec.get('oauth2?me=true').then(({ data }: { data: User }) => data), {
    enabled: false,
    onError: (e: AxiosError) => {
      if (!toast.isActive('user-fetching-error'))
        toast({
          id: 'user-fetching-error',
          title: t('common.error'),
          description: t('user.error_fetching', { e: e?.response?.data?.ErrorDescription }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });
};

export const useGetAvatar = ({ id, enabled, cache }: { id: string; enabled?: boolean; cache: string }) =>
  useQuery(
    ['get-user-avatar', id, cache],
    () => axiosSec.get(`avatar/${id}?cache=${cache}`, { responseType: 'arraybuffer' }),
    {
      enabled,
    },
  );

export const useDeleteAccountToken = ({
  setCurrentToken,
}: {
  setCurrentToken: Dispatch<SetStateAction<string | undefined>>;
}) =>
  useMutation(
    (token: string) =>
      axiosSec
        .delete(`/oauth2/${token}`)
        .then(() => true)
        .catch(() => false),
    {
      onSettled: () => {
        localStorage.removeItem('access_token');
        sessionStorage.clear();
        setCurrentToken('');
        window.location.replace('/');
      },
    },
  );
