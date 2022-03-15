import { useQuery } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';

export const useGetSubscribers = ({ t, toast }) =>
  useQuery(['get-subscribers'], () => axiosSec.get('subusers').then(({ data }) => data.users), {
    staleTime: 30000,
    onError: (e) => {
      if (!toast.isActive('subscribers-fetching-error'))
        toast({
          id: 'subscribers-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('subscribers.title'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });

export const useGetSubscriber = ({ t, toast, id, enabled }) =>
  useQuery(
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
