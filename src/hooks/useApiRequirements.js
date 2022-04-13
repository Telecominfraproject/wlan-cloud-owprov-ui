import { useMemo } from 'react';
import { secUrl } from 'utils/axiosInstances';
import useGetRequirements from './Network/Requirements';

const useApiRequirements = () => {
  const { data: requirements } = useGetRequirements();

  const toReturn = useMemo(
    () => ({
      passwordPattern: requirements?.passwordPattern ?? null,
      passwordPolicyLink: `${secUrl.split('/api/v1')[0]}${
        requirements?.passwordPolicy ?? '/wwwassets/password_policy.html'
      }`,
      isLoaded: requirements !== undefined && requirements !== null,
    }),
    [requirements],
  );

  return toReturn;
};

export default useApiRequirements;
