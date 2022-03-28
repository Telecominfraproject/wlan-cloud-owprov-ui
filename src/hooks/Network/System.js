import { useQuery } from 'react-query';

export const useGetSystemInfo = ({ t, toast, axiosInstance, name }) =>
  useQuery(['get-system-info', name], () => axiosInstance.get('/system?command=info').then(({ data }) => data), {
    staleTime: 60000,
    onError: (e) => {
      if (!toast.isActive('system-fetching-error'))
        toast({
          id: 'system-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('system.title'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });

export const useGetSubsystems = ({ t, toast, enabled, axiosInstance, name }) =>
  useQuery(
    ['get-subsystems', name],
    () => axiosInstance.post('/system', { command: 'getsubsystemnames' }).then(({ data }) => data),
    {
      staleTime: 60000,
      enabled,
      onError: (e) => {
        if (!toast.isActive('subsystems-fetching-error'))
          toast({
            id: 'subsystems-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('system.title'),
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
