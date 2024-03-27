import * as React from 'react';
import { useGetSelectInventoryPaginated } from 'hooks/Network/Inventory';
import { useGetVenue } from 'hooks/Network/Venues';
import { PageInfo } from 'models/Table';

type Props = {
  venueId: string;
};

export const useVenueInventory = ({ venueId }: Props) => {
  const [pageInfo, setPageInfo] = React.useState<PageInfo>();
  const getVenue = useGetVenue({ id: venueId });
  const getTags = useGetSelectInventoryPaginated({ pageInfo, serialNumbers: getVenue.data?.devices ?? [] });

  return {
    getVenue,
    getTags,
    pageInfo,
    setPageInfo,
  };
};
