import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'models/Axios';
import { Note } from 'models/Note';
import { PageInfo, SortInfo } from 'models/Table';
import { axiosAnalytics } from 'utils/axiosInstances';

export type AnalyticsBoardDevice = {
  associations_2g: number;
  associations_5g: number;
  associations_6g: number;
  boardId: string;
  connected: boolean;
  connectionIp: string;
  deviceType: string;
  health: number;
  lastConnection: number;
  lastContact: number;
  lastDisconnection: number;
  lastFirmware: string;
  lastFirmwareUpdate: number;
  lastHealth: number;
  lastPing: number;
  lastState: number;
  locale: string;
  memory: number;
  pings: number;
  serialNumber: string;
  states: number;
  type: string;
  uptime: number;
};

export type AnalyticsBoardDevicesApiResponse = {
  devices: AnalyticsBoardDevice[];
};

export type AnalyticsBoardApiResponse = {
  created: number;
  description: string;
  id: string;
  modified: number;
  name: string;
  notes: Note[];
  tags: string[];
  venueList: {
    description: string;
    id: string;
    interval: number;
    monitorSubVenues: boolean;
    name: string;
    retention: number;
  };
};

export type AnalyticsClientLifecycleApiResponse = {
  ack_signal: number;
  ack_signal_avg: number;
  active_ms: number;
  bssid: string;
  busy_ms: number;
  channel: number;
  channel_width: number;
  connected: number;
  inactive: number;
  ipv4: string;
  ipv6: string;
  mode: string;
  noise: number;
  receive_ms: number;
  rssi: number;
  rx_bitrate: number;
  rx_bytes: number;
  rx_chwidth: number;
  rx_duration: number;
  rx_mcs: number;
  rx_nss: number;
  rx_packets: number;
  rx_vht: boolean;
  ssid: string;
  station_id: string;
  timestamp: number;
  tx_bitrate: number;
  tx_bytes: number;
  tx_chwidth: number;
  tx_duration: number;
  tx_mcs: number;
  tx_nss: number;
  tx_packets: number;
  tx_power: number;
  tx_retries: number;
  tx_vht: boolean;
  venue_id: string;
};

export type AnalyticsApData = {
  collisions: number;
  multicast: number;
  rx_bytes: number;
  rx_bytes_bw: number;
  rx_bytes_delta: number;
  rx_dropped: number;
  rx_dropped_delta: number;
  rx_dropped_pct: number;
  rx_errors: number;
  rx_errors_delta: number;
  rx_errors_pct: number;
  rx_packets: number;
  rx_packets_bw: number;
  rx_packets_delta: number;
  tx_bytes: number;
  tx_bytes_bw: number;
  tx_bytes_delta: number;
  tx_dropped: number;
  tx_dropped_delta: number;
  tx_dropped_pct: number;
  tx_errors: number;
  tx_errors_delta: number;
  tx_errors_pct: number;
  tx_packets: number;
  tx_packets_bw: number;
  tx_packets_delta: number;
};

export type AnalyticsRadioData = {
  active_ms: number;
  active_pct: number;
  band: number;
  busy_ms: number;
  busy_pct: number;
  channel: number;
  channel_width: number;
  noise: number;
  receive_ms: number;
  receive_pct: number;
  temperature: number;
  transmit_ms: number;
  transmit_pct: number;
  tx_power: number;
};

export type AnalyticsAssociationData = {
  connected: number;
  inactive: number;
  rssi: number;
  rx_bytes: number;
  rx_bytes_bw: number;
  rx_bytes_delta: number;
  rx_packets: number;
  rx_packets_bw: number;
  rx_packets_delta: number;
  rx_rate: {
    bitrate: number;
    chwidth: number;
    ht: boolean;
    mcs: number;
    nss: number;
    sgi: boolean;
  };
  station: string;
  tx_bytes: number;
  tx_bytes_bw: number;
  tx_bytes_delta: number;
  tx_duration: number;
  tx_duration_delta: number;
  tx_duration_pct: number;
  tx_failed: number;
  tx_failed_delta: number;
  tx_failed_pct: number;
  tx_packets: number;
  tx_packets_bw: number;
  tx_packets_delta: number;
  tx_rate: {
    bitrate: number;
    chwidth: number;
    ht: boolean;
    mcs: number;
    nss: number;
    sgi: boolean;
  };
  tx_retries: number;
  tx_retries_delta: number;
  tx_retries_pct: number;
};

export type AnalyticsSsidData = {
  associations: AnalyticsAssociationData[];
  band: 2;
  bssid: string;
  channel: number;
  mode: string;
  rx_bytes_bw: {
    avg: number;
    max: number;
    min: number;
  };
  rx_packets_bw: {
    avg: number;
    max: number;
    min: number;
  };
  ssid: string;
  tx_bytes_bw: {
    avg: number;
    max: number;
    min: number;
  };
  tx_duration_pct: {
    avg: number;
    max: number;
    min: number;
  };
  tx_failed_pct: {
    avg: number;
    max: number;
    min: number;
  };
  tx_packets_bw: {
    avg: number;
    max: number;
    min: number;
  };
  tx_retries_pct: {
    avg: number;
    max: number;
    min: number;
  };
};

export type AnalyticsTimePointApiResponse = {
  ap_data: AnalyticsApData;
  boardId: string;
  device_info: AnalyticsBoardDevice;
  id: string;
  radio_data: AnalyticsRadioData[];
  serialNumber: string;
  ssid_data: AnalyticsSsidData[];
  timestamp: number;
};

export type AnalyticsTimePointsApiResponse = {
  points: AnalyticsTimePointApiResponse[][];
};

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

export const useCreateAnalyticsBoard = () => useMutation((newBoard) => axiosAnalytics.post('board/0', newBoard));

export const useUpdateAnalyticsBoard = () =>
  useMutation((newBoard: { id: string }) => axiosAnalytics.put(`board/${newBoard.id}`, newBoard));

export const useDeleteAnalyticsBoard = () => useMutation((id) => axiosAnalytics.delete(`board/${id}`, {}));
