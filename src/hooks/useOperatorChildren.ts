import { useMemo } from 'react';
import useGetDeviceTypes from './Network/DeviceTypes';
import { useGetServiceClasses } from './Network/ServiceClasses';
import { useGetSubscribers } from './Network/Subscribers';

const useOperatorChildren = ({ operatorId }: { operatorId: string }) => {
  const { data: deviceTypes, isFetching: isFetchingDeviceTypes } = useGetDeviceTypes();
  const { data: serviceClasses, isFetching: isFetchingServices } = useGetServiceClasses({ operatorId });
  const { data: subscribers, isFetching: isFetchingSubscribers } = useGetSubscribers({ operatorId });

  const isFetching = useMemo(
    () => isFetchingDeviceTypes || isFetchingServices || isFetchingSubscribers,
    [isFetchingDeviceTypes, isFetchingServices, isFetchingSubscribers],
  );

  const isLoaded = useMemo(
    () => deviceTypes && serviceClasses && subscribers,
    [deviceTypes, serviceClasses, subscribers],
  );

  const toResult = useMemo(
    () => ({
      deviceTypes,
      serviceClasses,
      subscribers,
      isFetching,
      isLoaded,
    }),
    [isFetching, isLoaded],
  );

  return toResult;
};

export default useOperatorChildren;
