import { useQuery } from 'react-query';
import { axiosRrm } from 'utils/axiosInstances';

export type RrmProvider = {
  vendor: string;
  vendorShortname: string;
  version: string;
  about: string;
};
export const useGetRrmProvider = () =>
  useQuery(['get-rrm-provider'], () => axiosRrm.get('provider').then(({ data }) => data), {
    staleTime: Infinity,
  });

export type RrmAlgorithm = {
  name: string;
  description: string;
  shortName: string;
  parameterFormat: string;
  parameterSamples: string;
  helper: string;
};
export const useGetRrmAlgorithms = () =>
  useQuery(
    ['get-rrm-algorithms'],
    () => axiosRrm.get('algorithms').then(({ data }: { data: RrmAlgorithm[] }) => data),
    {
      staleTime: Infinity,
    },
  );
