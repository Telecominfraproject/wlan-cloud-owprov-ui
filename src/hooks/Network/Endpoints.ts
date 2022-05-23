import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Endpoint } from 'models/Endpoint';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { axiosGw, axiosSec } from 'utils/axiosInstances';

export const useGetEndpoints = ({ onSuccess }: { onSuccess: (data: Endpoint[]) => void }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-endpoints'], () => axiosSec.get('systemEndpoints').then(({ data }) => data.endpoints), {
    enabled: false,
    staleTime: Infinity,
    onSuccess,
    onError: (e: AxiosError) => {
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
};

export const useGetGatewayUi = () =>
  useQuery(['get-gw-ui'], () => axiosGw.get('system?command=info').then(({ data }) => data.UI), {
    enabled: true,
    staleTime: Infinity,
  });
