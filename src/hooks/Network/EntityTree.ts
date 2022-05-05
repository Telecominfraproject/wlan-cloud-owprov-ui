import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { axiosProv, axiosSec } from 'utils/axiosInstances';

export default () => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-entity-tree'], () => axiosProv.get('entity?getTree=true').then(({ data }) => data), {
    enabled: axiosProv.defaults.baseURL !== axiosSec.defaults.baseURL,
    staleTime: 3600 * 1000,
    onError: (e: AxiosError) => {
      if (!toast.isActive('entity-tree-fetching-error'))
        toast({
          id: 'entity-tree-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('entities.tree'),
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
