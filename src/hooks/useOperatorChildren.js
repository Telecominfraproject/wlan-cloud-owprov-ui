import { useMemo } from 'react';
import useGetDeviceTypes from './Network/DeviceTypes';
import { useGetOperatorContacts } from './Network/OperatorContacts';
import { useGetOperatorLocations } from './Network/OperatorLocations';
import { useGetServiceClasses } from './Network/ServiceClasses';

const useOperatorChildren = ({ operatorId }) => {
  const { data: deviceTypes, isFetchingDeviceTypes } = useGetDeviceTypes();
  const { data: contacts, isFetching: isFetchingContacts } = useGetOperatorContacts({ operatorId });
  const { data: locations, isFetching: isFetchingLocations } = useGetOperatorLocations({ operatorId });
  const { data: serviceClasses, isFetching: isFetchingServices } = useGetServiceClasses({ operatorId });

  const isFetching = useMemo(
    () => isFetchingDeviceTypes || isFetchingContacts || isFetchingLocations || isFetchingServices,
    [isFetchingDeviceTypes, isFetchingContacts, isFetchingLocations, isFetchingServices],
  );

  const isLoaded = useMemo(
    () => deviceTypes && contacts && locations && serviceClasses,
    [deviceTypes, contacts, locations, serviceClasses],
  );

  const toResult = useMemo(
    () => ({
      deviceTypes,
      contacts,
      locations,
      serviceClasses,
      isFetching,
      isLoaded,
    }),
    [isFetching, isLoaded],
  );

  return toResult;
};

export default useOperatorChildren;
