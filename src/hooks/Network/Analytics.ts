import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { PageInfo, SortInfo } from 'models/Table';
import { axiosAnalytics } from 'utils/axiosInstances';

export const useGetAnalyticsBoard = ({ id }: { id?: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(['get-board', id], () => axiosAnalytics.get(`board/${id}`).then(({ data }) => data), {
    enabled: id !== undefined && id !== null && id.length > 0,
    onError: (e: AxiosError) => {
      if (!toast.isActive('board-fetching-error'))
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
  });
};

export const useGetAnalyticsBoardDevices = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-board-devices', id],
    () => axiosAnalytics.get(`board/${id}/devices`).then(({ data }) => data.devices),
    {
      enabled: id !== undefined && id !== null && id.length > 0,
      onError: (e: AxiosError) => {
        if (!toast.isActive('board-fetching-error'))
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

const getPartialClients = async (venueId: string, offset: number) =>
  axiosAnalytics
    .get(`wifiClientHistory?macsOnly=true&venue=${venueId}&limit=500&offset=${offset}`)
    .then(({ data }) => data.entries as string[]);

export const getAllClients = async (venueId: string) => {
  const allClients: string[] = [];
  let continueFirmware = true;
  let offset = 0;
  while (continueFirmware) {
    // eslint-disable-next-line no-await-in-loop
    const newClients = await getPartialClients(venueId, offset);
    if (newClients === null || newClients.length === 0 || newClients.length < 500 || offset >= 50000)
      continueFirmware = false;
    allClients.push(...newClients);
    offset += 500;
  }
  return allClients;
};

export const useGetAnalyticsClients = ({ venueId }: { venueId: string }) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-venue-analytics-clients', venueId],
    () => axiosAnalytics.get(`wifiClientHistory?macsOnly=true&venue=${venueId}`).then(({ data }) => data.entries),
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
    () => axiosAnalytics.get(`wifiClientHistory/0?orderSpec=true`).then(({ data }) => data.list),
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
        .then(({ data }) => data.count),
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
        .then(({ data }) => data.entries),
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
  id: string;
  startTime: Date;
  endTime?: Date;
  enabled?: boolean;
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  return useQuery(
    ['get-board-timepoints', id],
    () =>
      axiosAnalytics
        .get(
          `board/${id}/timepoints?fromDate=${Math.floor(startTime.getTime() / 1000)}${
            endTime ? `&endDate=${Math.floor(endTime.getTime() / 1000)}` : ''
          }`,
        )
        .then(({ data }) => data.points),
    {
      enabled: id !== null && enabled,
      onError: (e: AxiosError) => {
        if (!toast.isActive('board-fetching-error'))
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

export const useCreateAnalyticsBoard = () => useMutation((newBoard) => axiosAnalytics.post('board/0', newBoard));

export const useUpdateAnalyticsBoard = () =>
  useMutation((newBoard: { id: string }) => axiosAnalytics.put(`board/${newBoard.id}`, newBoard));

export const useDeleteAnalyticsBoard = () => useMutation((id) => axiosAnalytics.delete(`board/${id}`, {}));
