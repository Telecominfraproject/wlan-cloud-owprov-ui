import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetServiceClasses = ({ t, toast, enabled, operatorId }) =>
  useQuery(
    ['get-service-classes-operator'],
    () => axiosProv.get(`serviceClass?operatorId=${operatorId}`).then(({ data }) => data.serviceClasses),
    {
      enabled,
      onError: (e) => {
        if (!toast.isActive('service-classes-fetching-error'))
          toast({
            id: 'service-classes-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('service.other'),
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

export const useGetServiceClass = ({ t, toast, enabled, id }) =>
  useQuery(['get-service-class', id], () => axiosProv.get(`serviceClass/${id}`).then(({ data }) => data), {
    enabled,
    onError: (e) => {
      if (!toast.isActive('service-class-fetching-error'))
        toast({
          id: 'service-class-fetching-error',
          title: t('common.error'),
          description: t('crud.error_fetching_obj', {
            obj: t('service.one'),
            e: e?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    },
  });

export const useCreateServiceClass = () => useMutation((newOperator) => axiosProv.post(`serviceClass/1`, newOperator));

export const useUpdateServiceClass = ({ id }) =>
  useMutation((newOperator) => axiosProv.put(`serviceClass/${id}`, newOperator));

export const useDeleteServiceClass = ({ id }) => useMutation(() => axiosProv.delete(`serviceClass/${id}`));
