import { useQuery } from 'react-query';
import { axiosSec } from 'utils/axiosInstances';

const useGetRequirements = () =>
  useQuery(['get-requirements'], () => axiosSec.post('oauth2?requirements=true', {}).then(({ data }) => data), {
    staleTime: Infinity,
  });

export default useGetRequirements;
