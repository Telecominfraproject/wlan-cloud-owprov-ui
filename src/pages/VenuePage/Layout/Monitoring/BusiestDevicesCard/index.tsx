/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { Box, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useVenueMonitoring } from '../VenueMonitoringContext';
import { DataGrid } from 'components/DataGrid';
import { DataGridColumn, useDataGrid } from 'components/DataGrid/useDataGrid';
import DataCell from 'components/TableCells/DataCell';
import { AnalyticsBoardDevice } from 'models/Analytics';

const dataCell = (v: number) => (
  <Box textAlign="right">
    <DataCell bytes={v} showZerosAs="-" />
  </Box>
);

const BusiestVenueDevicesCard = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = React.useState<'associations' | 'traffic'>('associations');
  const { monitoring } = useVenueMonitoring();
  const tableController = useDataGrid({
    tableSettingsId: 'provisioning.monitoring.busiestDevices.table',
    defaultSortBy: [
      { id: 'associations_2g', desc: true },
      { id: 'associations_5g', desc: true },
      { id: 'associations_6g', desc: true },
    ],
    defaultOrder: [
      'serialNumber',
      'rxBytes',
      'txBytes',
      'associations_2g',
      'associations_5g',
      'associations_6g',
      'health',
      'memory',
    ],
  });

  const onFilterChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value as 'associations' | 'traffic';

      setFilter(val);

      if (val === 'associations') {
        tableController.setSortBy([
          { id: 'associations_2g', desc: true },
          { id: 'associations_5g', desc: true },
          { id: 'associations_6g', desc: true },
        ]);
      } else {
        tableController.setSortBy([
          { id: 'txBytes', desc: true },
          { id: 'rxBytes', desc: true },
        ]);
      }
    },
    [tableController],
  );

  const busiestDevices = React.useMemo(
    () =>
      monitoring
        .map(
          (device) =>
            ({
              ...device.dashboardData,
              totalAssociations:
                device.dashboardData.associations_2g +
                device.dashboardData.associations_5g +
                device.dashboardData.associations_6g,
              totalTraffic: device.deltas.rxBytes + device.deltas.txBytes,
              rxBytes: device.deltas.rxBytes,
              txBytes: device.deltas.txBytes,
            } as AnalyticsBoardDevice & {
              totalAssociations: number;
              totalTraffic: number;
              rxBytes: number;
              txBytes: number;
            }),
        )
        .sort((a, b) =>
          filter === 'associations'
            ? a.totalAssociations > b.totalAssociations
              ? -1
              : 1
            : a.totalTraffic > b.totalTraffic
            ? -1
            : 1,
        )
        .slice(0, 10),
    [monitoring, filter],
  );

  const columns: DataGridColumn<
    AnalyticsBoardDevice & { totalAssociations: number; rxBytes: number; txBytes: number }
  >[] = React.useMemo(
    () => [
      {
        id: 'serialNumber',
        header: t('inventory.serial_number'),
        accessorKey: 'serialNumber',
        meta: {
          customMaxWidth: '200px',
          customWidth: 'calc(15vh)',
          customMinWidth: '150px',
          alwaysShow: true,
          isMonospace: true,
        },
      },
      {
        id: 'rxBytes',
        header: 'Rx',
        footer: '',
        accessorKey: 'rxBytes',
        cell: (v) => dataCell(v.cell.row.original.rxBytes),
        meta: {
          customWidth: '50px',
          headerStyleProps: {
            textAlign: 'right',
          },
        },
      },
      {
        id: 'txBytes',
        header: 'Tx',
        footer: '',
        accessorKey: 'txBytes',
        cell: (v) => dataCell(v.cell.row.original.txBytes),
        meta: {
          customWidth: '40px',
          customMinWidth: '40px',
          headerStyleProps: {
            textAlign: 'right',
          },
        },
      },
      {
        id: 'associations_2g',
        header: '2G',
        accessorKey: 'associations_2g',
        meta: {
          customMinWidth: '1%',
        },
      },
      {
        id: 'associations_5g',
        header: '5G',
        accessorKey: 'associations_5g',
        meta: {
          customMinWidth: '1%',
        },
      },
      {
        id: 'associations_6g',
        header: '6G',
        accessorKey: 'associations_6g',
        meta: {
          customMinWidth: '1%',
        },
      },
      {
        id: 'health',
        header: t('analytics.health'),
        accessorKey: 'health',
        cell: ({ cell }) => `${Math.floor(cell.row.original.health * 100) / 100}%`,
      },
      {
        id: 'memory',
        header: t('analytics.memory'),
        accessorKey: 'memory',
        cell: ({ cell }) => `${Math.floor(cell.row.original.memory * 100) / 100}%`,
      },
    ],
    [t],
  );

  return (
    <DataGrid<AnalyticsBoardDevice & { totalAssociations: number; rxBytes: number; txBytes: number }>
      controller={tableController}
      header={{
        title: 'Top 10 Busiest Devices',
        objectListed: t('devices.title'),
        otherButtons: (
          <Select value={filter} onChange={onFilterChange}>
            <option value="associations">Clients</option>
            <option value="traffic">Traffic</option>
          </Select>
        ),
      }}
      columns={columns}
      data={busiestDevices}
      options={{
        isManual: false,
        minimumHeight: '200px',
        showAsCard: true,
        isHidingControls: true,
      }}
    />
  );
};

export default BusiestVenueDevicesCard;
