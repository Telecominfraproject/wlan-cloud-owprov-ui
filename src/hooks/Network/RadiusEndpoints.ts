/* eslint-disable no-await-in-loop */
import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AtLeast } from 'models/General';
import { Note } from 'models/Note';
import { axiosProv } from 'utils/axiosInstances';

export type RadiusServer = {
  Hostname: string;
  IP: string;
  Port: number;
  Secret: number;
};

export type RadiusEndpointServer = {
  Authentication: RadiusServer[];
  Accounting: RadiusServer[];
  CoA: RadiusServer[];
  AccountingInterval: number;
};

export type RadsecServer = {
  /**
   * It should be the ID of a google orion account OR the certificate ID of the global reach account
   * If not empty, only Weight needs to be populated
   * If empty, all fields need to be populated
   */
  UseOpenRoamingAccount: string;
  Weight: number;
  Hostname: string;
  IP: string;
  Port: string;
  /** Default: radsec */
  Secret: string;
  Certificate: string;
  PrivateKey: string;
  CaCerts: string[];
  /** Default: false */
  AllowSelfSigned: boolean;
};

export const RADIUS_ENDPOINT_TYPES = ['generic', 'radsec', 'globalreach', 'orion'] as const;
export type RadiusEndpointType = (typeof RADIUS_ENDPOINT_TYPES)[number];

export const RADIUS_ENDPOINT_POOL_STRATEGIES = ['round_robin', 'weighted', 'random'] as const;
export type RadiusEndpointPoolStrategy = (typeof RADIUS_ENDPOINT_POOL_STRATEGIES)[number];

export type RadiusEndpoint = {
  id: string;
  name: string;
  description: string;
  notes: Note[];
  created: number;
  modified: number;
  Type: RadiusEndpointType;
  PoolStrategy: RadiusEndpointPoolStrategy;
  /**
   * If Type is radius, we need at least one entry
   * Else, it should be empty
   */
  RadiusServers: RadiusEndpointServer[];
  /**
   * If Type is radsec, orion or globalreach, we need at least one entry
   * Else, it should be empty
   */
  RadsecServers: RadsecServer[];
  /** Default: true */
  UseGWProxy: boolean;
  /**
   * An IP address that should be between 0.0.1.1 and 0.0.2.254
   */
  Index: string;
  /**
   * The ids of all configurations using this endpoint
   */
  UsedBy: string[];
  NasIdentifier: string;
  AccountingInterval: number;
};

const SINGLE_PATH = '/RADIUSEndPoint';
const COLLECTION_PATH = '/RADIUSEndPoints';

const QUERY_KEY = 'radius-endpoints';

const getEndpoints = (limit: number, offset: number) =>
  axiosProv.get(`${COLLECTION_PATH}?limit=${limit}&offset=${offset}`).then((res) => res.data as RadiusEndpoint[]);

const getAllEndpoints = async () => {
  const limit = 100;
  let offset = 0;
  const endpoints: RadiusEndpoint[] = [];
  let lastResponse = [] as RadiusEndpoint[];

  do {
    lastResponse = await getEndpoints(limit, offset);
    endpoints.push(...lastResponse);
    offset += limit;
  } while (lastResponse.length === limit);

  return endpoints;
};

export const useGetRadiusEndpoints = () =>
  useQuery({
    queryKey: [QUERY_KEY, 'all'],
    queryFn: getAllEndpoints,
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

const getEndpoint = (
  context: QueryFunctionContext<
    [
      string,
      {
        id?: string;
      },
    ]
  >,
) => axiosProv.get(`${SINGLE_PATH}/${context.queryKey[1].id}`).then((res) => res.data as RadiusEndpoint);

export const useGetRadiusEndpoint = ({ id }: { id?: string }) =>
  useQuery({
    queryKey: [QUERY_KEY, { id }],
    queryFn: getEndpoint,
    keepPreviousData: true,
    staleTime: 60 * 1000,
    enabled: !!id,
  });

const deleteEndpoint = async (id: string) => axiosProv.delete(`${SINGLE_PATH}/${id}`);

export const useDeleteRadiusEndpoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });
};

const updateEndpoint = async (endpoint: AtLeast<RadiusEndpoint, 'id'>) =>
  axiosProv.put(`${SINGLE_PATH}/${endpoint.id}`, endpoint);

export const useUpdateRadiusEndpoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });
};

const createEndpoint = async (endpoint: Omit<RadiusEndpoint, 'id' | 'UsedBy' | 'created' | 'modified'>) =>
  axiosProv.post(`${SINGLE_PATH}/0`, endpoint);

export const useCreateRadiusEndpoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });
};

const getLastTimeUpdatedOnGateway = async () =>
  axiosProv.get(`${COLLECTION_PATH}?currentStatus=true`).then(
    (res) =>
      res.data as {
        lastUpdate: number;
        lastConfigurationChange: number;
      },
  );

export const useGetRadiusEndpointLastGwUpdate = () =>
  useQuery({
    queryKey: [QUERY_KEY, { lastUpdatedOnly: true }],
    queryFn: getLastTimeUpdatedOnGateway,
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

const updateEndpointOnGateway = async () => axiosProv.put(`${COLLECTION_PATH}?updateEndpoints=true`);

export const useUpdateRadiusEndpointsOnGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEndpointOnGateway,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });
};
