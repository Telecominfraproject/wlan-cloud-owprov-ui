import { useMutation, useQuery } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';

export const useGetLocationCount = ({ t, toast, enabled }) =>
  useQuery(['get-location-count'], () => axiosProv.get('location?countOnly=true').then(({ data }) => data.count), {
    enabled,
    staleTime: 30000,
    onError: (e) => {
      if (!toast.isActive('location-count-fetching-error'))
        toast({
          id: 'location-count-fetching-error',
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
  });

export const useGetLocations = ({ t, toast, pageInfo, enabled, count }) =>
  useQuery(
    ['get-locations-with-pagination', pageInfo, count],
    () =>
      axiosProv
        .get(`location?withExtendedInfo=true&limit=${pageInfo.limit}&offset=${pageInfo.limit * pageInfo.index}`)
        .then(({ data }) => data.locations),
    {
      keepPreviousData: true,
      enabled,
      staleTime: 30000,
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

export const useGetSelectLocations = ({ t, toast, select, enabled = true }) =>
  useQuery(
    ['get-locations-select', select],
    () =>
      select.length === 0
        ? []
        : axiosProv.get(`location?withExtendedInfo=true&select=${select}`).then(({ data }) => data.locations),
    {
      enabled,
      staleTime: 100 * 1000,
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

export const useGetAllLocations = ({ t, toast, venueId }) =>
  useQuery(
    ['get-all-locations', venueId],
    () =>
      axiosProv
        .get(`${venueId ? `venue?locationsForVenue=${venueId}` : 'location?withExtendedInfo=true&limit=500&offset=0'}`)
        .then(({ data }) => data.locations),
    {
      staleTime: 1000 * 1000,
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

export const useGetLocation = ({ t, toast, enabled, id }) =>
  useQuery(['get-location', id], () => axiosProv.get(`location/${id}`).then(({ data }) => data), {
    enabled,
    onError: (e) => {
      if (!toast.isActive('location-fetching-error'))
        toast({
          id: 'location-fetching-error',
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
  });

export const useCreateLocation = () => useMutation((newLocation) => axiosProv.post('location/0', newLocation));

export const useUpdateLocation = ({ id }) => useMutation((newLocation) => axiosProv.put(`location/${id}`, newLocation));

const claimLocations = async (locationIds, entity) => {
  const addPromises = locationIds.map(async (id) =>
    axiosProv
      .put(`location/${id}`, {
        entity,
      })
      .then(() => ({
        id,
      }))
      .catch(() => ({ id, error: true })),
  );

  const claimResults = await Promise.all(addPromises);
  const claimErrors = claimResults.filter((res) => res.error).map((res) => res.id);

  return { claimErrors };
};

export const useClaimLocations = ({ entityId }) => useMutation((locationIds) => claimLocations(locationIds, entityId));
