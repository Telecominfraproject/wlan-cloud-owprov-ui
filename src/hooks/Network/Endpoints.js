import { useQuery } from 'react-query';
import { axiosGw, axiosSec } from 'utils/axiosInstances';

export const useGetEndpoints = ({ t, toast, onSuccess }) =>
  useQuery(['get-endpoints'], () => axiosSec.get('systemEndpoints').then(({ data }) => data.endpoints), {
    enabled: false,
    staleTime: Infinity,
    onSuccess,
    onError: (e) => {
      if (!toast.isActive('endpoints-fetching-error'))
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

export const useGetGatewayUi = () =>
  useQuery(['get-gw-ui'], () => axiosGw.get('system?command=info').then(({ data }) => data.UI), {
    enabled: true,
    staleTime: Infinity,
  });
