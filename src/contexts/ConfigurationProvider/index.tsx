import React, { useMemo } from 'react';
import { useGetConfiguration } from 'hooks/Network/Configurations';
import { useGetEntity } from 'hooks/Network/Entity';
import { useGetResources } from 'hooks/Network/Resources';
import { useGetVenue } from 'hooks/Network/Venues';
import { Resource } from 'models/Resource';

const ConfigurationContext = React.createContext<{
  configurationId: string;
  availableResources?: Resource[];
}>({
  configurationId: '',
});

export const ConfigurationProvider = ({
  children,
  configurationId,
  entityId,
}: {
  children: React.ReactElement;
  configurationId?: string;
  entityId?: string;
}) => {
  const getConfig = useGetConfiguration({ id: configurationId, onSuccess: () => {} });
  const venueId = () => {
    const split = entityId?.split(':');
    if (split?.[0] && split?.[1] && split[0] === 'ven') {
      return split[1];
    }
    return getConfig.data?.venue;
  };
  const finalEntityId = () => {
    const split = entityId?.split(':');
    if (split?.[0] && split?.[1] && split[0] === 'ent') {
      return split[1];
    }
    return getConfig.data?.entity;
  };

  const getVenue = useGetVenue({ id: venueId() });
  const getEntity = useGetEntity({ id: finalEntityId() });
  const getResources = useGetResources({
    pageInfo: null,
    select: getVenue.data?.variables ?? getEntity.data?.variables,
  });

  const value = useMemo(
    () => ({
      configurationId,
      availableResources: getResources.data,
    }),
    [getResources.data],
  );

  return <ConfigurationContext.Provider value={value}>{children}</ConfigurationContext.Provider>;
};

export const useConfigurationContext = () => React.useContext(ConfigurationContext);
