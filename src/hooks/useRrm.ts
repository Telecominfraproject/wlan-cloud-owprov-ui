/* eslint-disable import/prefer-default-export */
import * as React from 'react';
import { EndpointApiResponse, useGetEndpoints } from './Network/Endpoints';
import { useGetAllRrmAlgorithms, useGetRrmProviders } from './Network/Rrm';

export const useRrm = () => {
  const getProviders = useGetRrmProviders();
  const getEndpoints = useGetEndpoints({ onSuccess: () => {} });

  const providersWithEndpointInfo = React.useMemo(() => {
    if (getProviders.data && getEndpoints.data) {
      const providers = getProviders.data.map((provider) => {
        const endpoint = getEndpoints.data.find(({ type }) => type === provider);
        return endpoint ?? null;
      });
      return providers.filter((provider) => provider !== null) as EndpointApiResponse[];
    }
    return [];
  }, [getProviders.data, getEndpoints.data]);

  const getCompleteProviders = useGetAllRrmAlgorithms({ endpoints: providersWithEndpointInfo ?? [] });

  return {
    getProviders: getCompleteProviders,
  };
};
