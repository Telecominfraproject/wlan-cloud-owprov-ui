import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsBoardApiResponse,
  AnalyticsBoardDevicesApiResponse,
  AnalyticsClientLifecycleApiResponse,
  AnalyticsTimePointsApiResponse,
} from 'models/Analytics';
import { AxiosError } from 'models/Axios';
import { PageInfo, SortInfo } from 'models/Table';
import { axiosAnalytics } from 'utils/axiosInstances';

export const useGetAnalyticsBoard = ({ id }: { id?: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-board', id],
    () => axiosAnalytics.get(`board/${id}`).then(({ data }: { data: AnalyticsBoardApiResponse }) => data),
    {
      enabled: id !== undefined && id !== null && id.length > 0,
      onError: (e: AxiosError) => {
        if (e.response?.status !== 404 && !toast.isActive('board-fetching-error'))
          toast({
            id: 'board-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('analytics.board'),
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

export const useGetAnalyticsBoardDevices = ({ id }: { id?: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-board-devices', id],
    () =>
      axiosAnalytics
        .get(`board/${id}/devices`)
        .then(({ data }: { data: AnalyticsBoardDevicesApiResponse }) => data.devices),
    {
      enabled: id !== undefined && id !== null && id.length > 0,
      onError: (e: AxiosError) => {
        if (e.response?.status !== 404 && !toast.isActive('board-fetching-error'))
          toast({
            id: 'board-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('analytics.board'),
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

export const useGetAnalyticsClients = ({ venueId }: { venueId: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-venue-analytics-clients', venueId],
    () =>
      axiosAnalytics
        .get(`wifiClientHistory?macsOnly=true&venue=${venueId}`)
        .then(({ data }: { data: { entries: string[] } }) => data.entries),
    {
      onError: (e: AxiosError) => {
        if (!toast.isActive('get-venue-analytics-clients-error'))
          toast({
            id: 'get-venue-analytics-clients-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('analytics.board'),
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

export const useGetClientLifecycleTableSpecs = () =>
  useQuery(
    ['get-lifecycles-table-spec'],
    () =>
      axiosAnalytics
        .get(`wifiClientHistory/0?orderSpec=true`)
        .then(({ data }: { data: { list: string[] } }) => data.list),
    {
      staleTime: Infinity,
    },
  );

export const useGetClientLifecycleCount = ({
  venueId,
  mac,
  fromDate,
  endDate,
  refreshId,
}: {
  venueId: string;
  mac?: string;
  fromDate: number;
  endDate: number;
  refreshId: number;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-lifecycles', venueId, mac, fromDate, endDate, refreshId],
    () =>
      axiosAnalytics
        .get(`wifiClientHistory/${mac}?venue=${venueId}&countOnly=true&fromDate=${fromDate}&endDate=${endDate}`)
        .then(({ data }: { data: { count: number } }) => data.count),
    {
      enabled: mac !== undefined,
      onError: (e: AxiosError) => {
        if (!toast.isActive('lifecycle-count-fetching-error'))
          toast({
            id: 'lifecycle-count-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('analytics.board'),
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

export const useGetClientLifecycle = ({
  pageInfo,
  venueId,
  mac,
  count,
  sortInfo,
  fromDate,
  endDate,
  refreshId,
}: {
  pageInfo?: PageInfo;
  venueId: string;
  mac: string;
  enabled: boolean;
  count?: number;
  sortInfo?: SortInfo;
  fromDate: number;
  endDate: number;
  refreshId: number;
}) => {
  let sortString = '';
  if (sortInfo && sortInfo.length > 0) {
    sortString = `&orderBy=${sortInfo.map((info) => `${info.id}:${info.sort.charAt(0)}`).join(',')}`;
  }

  return useQuery(
    ['get-lifecycles-with-pagination', pageInfo, count, sortInfo, fromDate, endDate, refreshId],
    () =>
      axiosAnalytics
        .get(
          `wifiClientHistory/${mac}?venue=${venueId}&limit=${pageInfo?.limit ?? 10}&offset=${
            (pageInfo?.limit ?? 10) * (pageInfo?.index ?? 1)
          }${sortString}&fromDate=${fromDate}&endDate=${endDate}`,
        )
        .then(({ data }: { data: { entries: AnalyticsClientLifecycleApiResponse[] } }) => data.entries),
    {
      keepPreviousData: true,
      enabled: count !== undefined && pageInfo !== undefined,
      onError: () => [],
    },
  );
};

export const useGetAnalyticsBoardTimepoints = ({
  id,
  startTime,
  endTime,
  enabled = true,
}: {
  id?: string;
  startTime: Date;
  endTime?: Date;
  enabled?: boolean;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-venue-timepoints', id, startTime.toString(), endTime?.toString()],
    () =>
      axiosAnalytics
        .get(
          `board/${id}/timepoints?maxRecords=1000&fromDate=${Math.floor(startTime.getTime() / 1000)}${
            endTime ? `&endDate=${Math.floor(endTime.getTime() / 1000)}` : ''
          }`,
        )
        .then(({ data }: { data: AnalyticsTimePointsApiResponse }) => data.points),
    {
      enabled: id !== undefined && id !== '' && enabled,
      keepPreviousData: true,
      staleTime: Infinity,
      onError: (e: AxiosError) => {
        if (e.response?.status !== 404 && !toast.isActive('board-fetching-error'))
          toast({
            id: 'board-fetching-error',
            title: t('common.error'),
            description: t('crud.error_fetching_obj', {
              obj: t('analytics.board'),
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

export const useCreateAnalyticsBoard = () =>
  useMutation((newBoard: unknown) => axiosAnalytics.post('board/0', newBoard));

export const useUpdateAnalyticsBoard = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  return useMutation(
    (newBoard: {
      name: string;
      venueList: [
        {
          id: string;
          name: string;
          retention: number;
          interval: number;
          monitorSubVenues: boolean;
        },
      ];
    }) => axiosAnalytics.put(`board/${id}`, newBoard),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['get-board', id]);
      },
    },
  );
};

export const useDeleteAnalyticsBoard = () => useMutation((id: string) => axiosAnalytics.delete(`board/${id}`, {}));
