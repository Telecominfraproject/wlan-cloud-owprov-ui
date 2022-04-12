import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetOperatorLocations = ({ operatorId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  return useQuery(
    ['get-operator-locations', operatorId],
    () =>
      !operatorId
        ? []
        : axiosProv
            .get(`operatorLocation?withExtendedInfo=true&operatorId=${operatorId}`)
            .then(({ data }) => data.locations),
    {
      onError: (e) => {
        if (!toast.isActive('locations-fetching-error'))
          toast({
            id: 'locations-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('locations.other'),
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

export const useGetOperatorLocation = ({ enabled, id }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-operator-location', id],
    () => axiosProv.get(`operatorLocation/${id}`).then(({ data }) => data),
    {
      enabled,
      onError: (e) => {
        if (!toast.isActive('location-fetching-error'))
          toast({
            id: 'operator-location-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('locations.one'),
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

export const useCreateOperatorLocation = () =>
  useMutation((newLocation) => axiosProv.post('operatorLocation/0', newLocation));

export const useUpdateOperatorLocation = ({ id }) =>
  useMutation((newLocation) => axiosProv.put(`operatorLocation/${id}`, newLocation));

export const useDeleteOperatorLocation = ({ id }) => useMutation(() => axiosProv.delete(`operatorLocation/${id}`, {}));
