import * as React from 'react';
import { useGetEntity } from 'hooks/Network/Entity';
import { useGetSelectInventoryPaginated } from 'hooks/Network/Inventory';
import { PageInfo } from 'models/Table';

type Props = {
  entityId: string;
};

export const useEntityInventory = ({ entityId }: Props) => {
  const [pageInfo, setPageInfo] = React.useState<PageInfo>();
  const getEntity = useGetEntity({ id: entityId });
  const getTags = useGetSelectInventoryPaginated({ pageInfo, serialNumbers: getEntity.data?.devices ?? [] });

  return {
    getEntity,
    getTags,
    pageInfo,
    setPageInfo,
  };
};
