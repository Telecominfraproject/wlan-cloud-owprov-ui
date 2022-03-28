import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useGetEntityTree from 'hooks/Network/EntityTree';
import { useToast } from '@chakra-ui/react';
import { useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';
import { useQueryClient } from 'react-query';
import MapDisplayCard from './MapDisplayCard';
import { detailsTree, entitiesToObj, flattenEntityTree, getDevices, getTags } from './mapHelpers';

const MapCard = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: tree } = useGetEntityTree({ t, toast });
  const { data: entities } = useGetEntities({ t, toast });
  const { data: venues } = useGetVenues({ t, toast });
  const [groupedData, setGroupedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const createListOfEntitiesVenues = useCallback(async () => {
    if (tree && entities && venues) {
      const flatTree = flattenEntityTree(tree, undefined, undefined, []);
      const { obj: entityObj, devices: entDevices } = entitiesToObj(entities);
      const { obj: venuesObj, devices: venDevices } = entitiesToObj(venues);
      const fullDataTree = detailsTree(flatTree, entityObj, venuesObj);
      const tags = await getTags([...entDevices, ...venDevices]);
      const devices = await getDevices(tags.map((tag) => tag.serialNumber));
      setIsLoading(false);
      return {
        tree,
        flatTree: fullDataTree,
        entities: entityObj,
        venues: venuesObj,
        tags,
        devices,
      };
    }
    return null;
  }, [tree, entities, venues]);

  const refreshData = () => {
    queryClient.invalidateQueries(['get-entity-tree']);
    queryClient.invalidateQueries(['get-entities']);
    queryClient.invalidateQueries(['get-venues']);
  };

  useEffect(async () => {
    if (tree && entities && venues) {
      const newData = await createListOfEntitiesVenues();
      setGroupedData(newData);
    }
  }, [tree, entities, venues]);

  return <MapDisplayCard data={groupedData} isLoading={isLoading} refreshData={refreshData} />;
};

export default MapCard;
