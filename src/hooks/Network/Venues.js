import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetVenues = ({ t, toast }) =>
  useQuery(
    ['get-venues'],
    () =>
      axiosProv
        .get('venue?withExtendedInfo=true&offset=0&limit=500')
        .then(({ data }) => data.venues),
    {
      staleTime: 30000,
      onError: (e) => {
        if (!toast.isActive('venues-fetching-error'))
          toast({
            id: 'venues-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('venues.title'),
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

export const useGetSelectVenues = ({ t, toast, select }) =>
  useQuery(
    ['get-venues', select],
    () =>
      select.length === 0
        ? []
        : axiosProv
            .get(`venue?withExtendedInfo=true&select=${select}`)
            .then(({ data }) => data.venues),
    {
      staleTime: 100 * 1000,
      onError: (e) => {
        if (!toast.isActive('venues-fetching-error'))
          toast({
            id: 'venues-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('venues.title'),
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

export const useGetVenue = ({ t, toast, id }) =>
  useQuery(
    ['get-venue', id],
    () => axiosProv.get(`venue/${id}?withExtendedInfo=true`).then(({ data }) => data),
    {
      onError: (e) => {
        if (!toast.isActive('venue-fetching-error'))
          toast({
            id: 'subscribers-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('venues.one'),
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

export const useCreateVenue = () =>
  useMutation(({ params, createObjects }) =>
    axiosProv.post(
      `venue/0${createObjects ? `?createObjects=${JSON.stringify(createObjects)}` : ''}`,
      params,
    ),
  );

export const useUpdateVenue = ({ id }) =>
  useMutation(({ params, createObjects }) =>
    axiosProv.put(
      `venue/${id}${createObjects ? `?createObjects=${JSON.stringify(createObjects)}` : ''}`,
      params,
    ),
  );

export const useDeleteVenue = () => useMutation((id) => axiosProv.delete(`venue/${id}`));
