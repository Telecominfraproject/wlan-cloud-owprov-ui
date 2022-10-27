import { useQuery } from '@tanstack/react-query';
import { axiosFms } from 'utils/axiosInstances';

const useGetDeviceTypes = () =>
  useQuery(['get-device-types'], () => axiosFms.get('/firmwares?deviceSet=true').then(({ data }) => data.deviceTypes), {
    staleTime: Infinity,
  });

export default useGetDeviceTypes;
