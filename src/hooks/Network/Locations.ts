import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'models/Axios';
import { CreateLocation, Location } from 'models/Location';
import { PageInfo } from 'models/Table';
import { axiosProv } from 'utils/axiosInstances';

export const useGetLocationCount = ({ enabled }: { enabled: boolean }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-location-count'],
    () => axiosProv.get('location?countOnly=true').then(({ data }) => data.count as number),
    {
      enabled,
      staleTime: 30000,
      onError: (e: AxiosError) => {
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
    },
  );
};

export const useGetLocations = ({
  pageInfo,
  enabled,
  count,
}: {
  pageInfo: PageInfo;
  enabled: boolean;
  count: number;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-locations-with-pagination', pageInfo, count],
    () =>
      axiosProv
        .get(`location?withExtendedInfo=true&limit=${pageInfo.limit}&offset=${pageInfo.limit * pageInfo.index}`)
        .then(({ data }) => data.locations as Location[]),
    {
      keepPreviousData: true,
      enabled,
      staleTime: 30000,
      onError: (e: AxiosError) => {
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

export const useGetSelectLocations = ({ select, enabled = true }: { select: string[]; enabled: boolean }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-locations-select', select],
    () =>
      select.length === 0
        ? []
        : axiosProv
            .get(`location?withExtendedInfo=true&select=${select}`)
            .then(({ data }) => data.locations as Location[]),
    {
      enabled,
      staleTime: 100 * 1000,
      onError: (e: AxiosError) => {
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

const getLocationsBatch = async (limit: number, offset: number, venueId?: string) =>
  axiosProv
    .get(
      `${
        venueId
          ? `venue?locationsForVenue=${venueId}&limit=${limit}&offset=${offset}`
          : `location?withExtendedInfo=true&limit=${limit}&offset=${offset}`
      }`,
    )
    .then(({ data }) => data.locations as Location[]);

const getAllLocations = async (venueId?: string) => {
  const limit = 500;
  let offset = 0;
  let data: Location[] = [];
  let lastResponse: Location[] = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    lastResponse = await getLocationsBatch(limit, offset, venueId);
    data = data.concat(lastResponse);
    offset += limit;
  } while (lastResponse.length === limit && venueId === undefined);
  return data;
};

export const useGetAllLocations = ({ venueId }: { venueId?: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-all-locations', venueId], () => getAllLocations(venueId), {
    staleTime: 1000 * 60,
    onError: (e: AxiosError) => {
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
  });
};

export const useGetAllVenueLocations = ({ venueId }: { venueId: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-all-locations', venueId],
    () =>
      axiosProv
        .get(`venue?locationsForVenue=${venueId}`)
        .then(({ data }) => data.locations as { uuid: string; name: string }[]),
    {
      staleTime: 1000 * 1000,
      onError: (e: AxiosError) => {
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

export const useGetLocation = ({ enabled, id }: { enabled: boolean; id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-location', id], () => axiosProv.get(`location/${id}`).then(({ data }) => data as Location), {
    enabled,
    staleTime: Infinity,
    onError: (e: AxiosError) => {
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
};

export const useCreateLocation = () =>
  useMutation((newLocation: CreateLocation) =>
    axiosProv.post('location/0', newLocation).then(({ data }) => data as Location),
  );

export const useUpdateLocation = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  return useMutation(
    (newLocation: CreateLocation) => axiosProv.put(`location/${id}`, newLocation).then(({ data }) => data as Location),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['get-location', id], data);
      },
    },
  );
};
