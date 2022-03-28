import { useQuery } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';

const getAvatarPromises = (userList) => {
  const promises = userList.map(async (user) => {
    if (user.avatar !== '' && user.avatar !== '0') {
      return axiosSec.get(`avatar/${user.id}?cache=${user.avatar}`, {
        responseType: 'arraybuffer',
      });
    }
    return Promise.resolve('');
  });

  return promises;
};

export const useGetUsers = ({ t, toast, setUsersWithAvatars }) =>
  useQuery(['get-users'], () => axiosSec.get('users').then(({ data }) => data.users), {
    onSuccess: async (users) => {
      const avatars = await Promise.allSettled(getAvatarPromises(users)).then((results) =>
        results.map((response) => {
          if (response.status === 'fulfilled' && response?.value !== '') {
            const base64 = btoa(
              new Uint8Array(response.value.data).reduce((respData, byte) => respData + String.fromCharCode(byte), ''),
            );
            return `data:;base64,${base64}`;
          }
          return '';
        }),
      );

      const newUsers = users.map((newUser, i) => ({ ...newUser, avatar: avatars[i] }));
      setUsersWithAvatars(newUsers);
    },
    onError: (e) => {
      if (!toast.isActive('users-fetching-error'))
        toast({
          id: 'users-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('users.title'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });

export const useGetUser = ({ t, toast, id, enabled }) =>
  useQuery(['get-user', id], () => axiosSec.get(`user/${id}?withExtendedInfo=true`).then(({ data }) => data), {
    enabled,
    onError: (e) => {
      if (!toast.isActive('user-fetching-error'))
        toast({
          id: 'user-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('users.one'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });
