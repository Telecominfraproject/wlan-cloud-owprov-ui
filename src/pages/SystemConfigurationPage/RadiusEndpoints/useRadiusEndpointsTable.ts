import { useDisclosure } from '@chakra-ui/react';
import { useDataGrid } from 'components/DataGrid/useDataGrid';
import { useGetRadiusEndpoints } from 'hooks/Network/RadiusEndpoints';

export type UseRadiusEndpointsTableProps = {
  tableSettingsId: string;
};
export const useRadiusEndpointsTable = ({ tableSettingsId }: UseRadiusEndpointsTableProps) => {
  const controller = useDataGrid({
    tableSettingsId,
    defaultSortBy: [{ id: 'name', desc: false }],
    defaultOrder: ['name'],
  });
  const getRadiusEndpoints = useGetRadiusEndpoints();
  const editModalProps = useDisclosure();

  return {
    controller,
    getRadiusEndpoints,
    editModalProps,
  };
};
