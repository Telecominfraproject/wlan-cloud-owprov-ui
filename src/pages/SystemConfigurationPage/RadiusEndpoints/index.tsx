import * as React from 'react';
import { Tag } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CreateRadiusEndpointModal from './CreateModal';
import LastRadiusEndpointUpdateButton from './LastUpdateButton';
import RadiusEndpointActions from './TableActions';
import { useRadiusEndpointsTable } from './useRadiusEndpointsTable';
import useRadiusEndpointAccountModal from './ViewDetailsModal/useEditModal';
import { DataGrid } from 'components/DataGrid';
import { DataGridColumn } from 'components/DataGrid/useDataGrid';
import FormattedDate from 'components/FormattedDate';
import { useGetGlobalReachAccounts } from 'hooks/Network/GlobalReach';
import { useGetGoogleOrionAccounts } from 'hooks/Network/GoogleOrion';
import { RadiusEndpoint } from 'hooks/Network/RadiusEndpoints';

const dateCell = (date: number) => <FormattedDate date={date} />;
const actionCell = (row: RadiusEndpoint, open: (acc: RadiusEndpoint) => void) => (
  <RadiusEndpointActions endpoint={row} onEdit={open} />
);
const typeCell = (row: RadiusEndpoint) => {
  let colorScheme = 'blue';
  if (row.Type === 'orion') colorScheme = 'purple';
  if (row.Type === 'globalreach') colorScheme = 'green';
  if (row.Type === 'radsec') colorScheme = 'teal';

  return (
    <Tag colorScheme={colorScheme} size="md">
      {row.Type}
    </Tag>
  );
};

const RadiusEndpointsManagement = () => {
  const { t } = useTranslation();
  const table = useRadiusEndpointsTable({
    tableSettingsId: 'system.radiusEndpoints.table',
  });
  const getOrionAccounts = useGetGoogleOrionAccounts();
  const getGlobalReachAccounts = useGetGlobalReachAccounts();
  const modal = useRadiusEndpointAccountModal({});

  const columns: DataGridColumn<RadiusEndpoint>[] = React.useMemo(
    () => [
      {
        id: 'name',
        header: t('common.name'),
        accessorKey: 'name',
        meta: {
          alwaysShow: true,
          anchored: true,
          customWidth: '120px',
        },
      },
      {
        id: 'Type',
        header: t('common.type'),
        accessorKey: 'Type',
        cell: (cell) => typeCell(cell.row.original),
        meta: {
          customWidth: '120px',
        },
      },
      {
        id: 'Index',
        header: 'Index',
        accessorKey: 'Index',
        meta: {
          customWidth: '80px',
        },
      },
      {
        id: 'PoolStrategy',
        header: t('openroaming.pool_strategy'),
        accessorKey: 'PoolStrategy',
        meta: {
          customWidth: '120px',
        },
      },
      {
        id: 'created',
        header: t('common.created'),

        accessorKey: 'created',
        cell: (cell) => dateCell(cell.row.original.created),
        meta: {
          customMinWidth: '150px',
          customWidth: '150px',
        },
      },
      {
        id: 'modified',
        header: t('common.modified'),

        accessorKey: 'modified',
        cell: (cell) => dateCell(cell.row.original.modified),
        meta: {
          customMinWidth: '150px',
          customWidth: '150px',
        },
      },
      {
        id: 'description',
        header: t('common.description'),
        accessorKey: 'description',
        enableSorting: false,
      },
      {
        id: 'actions',
        header: '',
        accessorKey: 'id',
        cell: (cell) => actionCell(cell.row.original, modal.openModal),
        enableSorting: false,
        meta: {
          customWidth: '80px',
          alwaysShow: true,
          columnSelectorOptions: {
            label: t('common.actions'),
          },
        },
      },
    ],
    [t],
  );

  return (
    <>
      {modal.modal}
      <DataGrid<RadiusEndpoint>
        controller={table.controller}
        header={{
          title: t('openroaming.radius_endpoint_other'),
          objectListed: t('openroaming.radius_endpoint_other'),
          addButton: (
            <CreateRadiusEndpointModal
              // @ts-ignore
              orionAccounts={getOrionAccounts.data ?? []}
              // @ts-ignore
              globalReachAccounts={getGlobalReachAccounts.data ?? []}
            />
          ),
          otherButtons: <LastRadiusEndpointUpdateButton />,
        }}
        columns={columns}
        data={table.getRadiusEndpoints.data ?? []}
        isLoading={table.getRadiusEndpoints.isFetching}
        options={{
          refetch: table.getRadiusEndpoints.refetch,
          showAsCard: true,
          onRowClick: (row) => () => modal.openModal(row),
        }}
      />
    </>
  );
};

export default RadiusEndpointsManagement;
