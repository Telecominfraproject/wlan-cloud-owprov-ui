import { useMemo } from 'react';
import useGetDeviceTypes from './Network/DeviceTypes';
import { useGetOperatorContacts } from './Network/OperatorContacts';
import { useGetOperatorLocations } from './Network/OperatorLocations';
import { useGetServiceClasses } from './Network/ServiceClasses';
import { useGetSubscribers } from './Network/Subscribers';

const useOperatorChildren = ({ operatorId }) => {
  const { data: deviceTypes, isFetchingDeviceTypes } = useGetDeviceTypes();
  const { data: contacts, isFetching: isFetchingContacts } = useGetOperatorContacts({ operatorId });
  const { data: locations, isFetching: isFetchingLocations } = useGetOperatorLocations({ operatorId });
  const { data: serviceClasses, isFetching: isFetchingServices } = useGetServiceClasses({ operatorId });
  const { data: subscribers, isFetching: isFetchingSubscribers } = useGetSubscribers({ operatorId });

  const isFetching = useMemo(
    () =>
      isFetchingDeviceTypes || isFetchingContacts || isFetchingLocations || isFetchingServices || isFetchingSubscribers,
    [isFetchingDeviceTypes, isFetchingContacts, isFetchingLocations, isFetchingServices, isFetchingSubscribers],
  );

  const isLoaded = useMemo(
    () => deviceTypes && contacts && locations && serviceClasses && subscribers,
    [deviceTypes, contacts, locations, serviceClasses, subscribers],
  );

  const toResult = useMemo(
    () => ({
      deviceTypes,
      contacts,
      locations,
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
