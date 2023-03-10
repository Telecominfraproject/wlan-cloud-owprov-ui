import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { EndpointApiResponse } from './Endpoints';
import { axiosProv, axiosRrm } from 'utils/axiosInstances';

export type RrmProvider = {
  vendor: string;
  vendorShortname: string;
  version: string;
  about: string;
};

export type RrmAlgorithm = {
  name: string;
  description: string;
  shortName: string;
  parameterFormat: string;
  parameterSamples: string;
  helper: string;
};

export interface RrmProviderCompleteInformation extends EndpointApiResponse {
  algorithms: RrmAlgorithm[];
  rrm: RrmProvider;
}

const getRrmProvider = async (
  endpoint: EndpointApiResponse & { algorithms: RrmAlgorithm[] },
): Promise<RrmProviderCompleteInformation> =>
  axiosRrm
    .get(`${endpoint.uri}/api/v1/provider`)
    .then(({ data }: { data: RrmProvider }) => ({
      ...endpoint,
      rrm: data,
    }))
    .catch(() => ({
      ...endpoint,
      rrm: {
        vendor: '',
        vendorShortname: '',
        version: '',
        about: '',
      },
    }));

const getRrmAlgorithms = async (
  endpoint: EndpointApiResponse,
): Promise<EndpointApiResponse & { algorithms: RrmAlgorithm[] }> =>
  axiosRrm
    .get(`${endpoint.uri}/api/v1/algorithms`)
    .then(({ data }: { data: RrmAlgorithm[] }) => ({
      algorithms: data,
      ...endpoint,
    }))
    .catch(() => ({
      algorithms: [] as RrmAlgorithm[],
      ...endpoint,
    }));

const getAllAlgorithms = async (context: QueryFunctionContext<[string, string, EndpointApiResponse[]]>) => {
  const promises = context.queryKey[2].map((endpoint) => getRrmAlgorithms(endpoint));
  const providersWithAlgorithms: (EndpointApiResponse & { algorithms: RrmAlgorithm[] })[] = await Promise.all(promises);
  const promises2 = providersWithAlgorithms.map((provider) => getRrmProvider(provider));
  const completeProviders: RrmProviderCompleteInformation[] = await Promise.all(promises2);

  return completeProviders;
};

export const useGetAllRrmAlgorithms = ({ endpoints }: { endpoints: EndpointApiResponse[] }) =>
  useQuery(['rrm', 'providers', endpoints], getAllAlgorithms, {
    staleTime: 60 * 1000,
  });

export const useGetRrmProviders = () =>
  useQuery(
    ['rrm', 'providers'],
    () =>
      axiosProv
        .get('systemConfiguration?entries=rrm.providers')
        .then(({ data }: { data: { parameterName: string; parameterValue: string }[] }) => {
          const providers = data.find((entry) => entry.parameterName === 'rrm.providers');
          return providers?.parameterValue?.split(',').map((provider) => provider.trim()) ?? [];
        }),
    {
      staleTime: 60 * 1000,
    },
  );
