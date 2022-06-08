import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Spacer } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import ColumnPicker from 'components/ColumnPicker';
import {
  useGetClientLifecycle,
  useGetClientLifecycleCount,
  useGetClientLifecycleTableSpecs,
} from 'hooks/Network/Analytics';
import useControlledTable from 'hooks/useControlledTable';
import { Column, SortInfo } from 'models/Table';
import { UseQueryResult } from 'react-query';
import SortableDataTable from 'components/SortableDataTable';
import DecibelCell from 'components/TableCells/DecibelCell';
import DataCell from 'components/TableCells/DataCell';
import DurationCell from 'components/TableCells/DurationCell';
import BooleanCell from 'components/TableCells/BooleanCell';
import NumberCell from 'components/TableCells/NumberCell';

const ClientLifecyleTable: React.FC<{
  venueId: string;
  mac?: string;
  fromDate: number;
  endDate: number;
  refreshId: number;
  timePickers: React.ReactNode;
  searchBar: React.ReactNode;
}> = ({ venueId, mac, fromDate, endDate, refreshId, timePickers, searchBar }) => {
  const { t } = useTranslation();
  const [sortInfo, setSortInfo] = useState<SortInfo>([{ id: 'timestamp', sort: 'dsc' }]);
  const {
    count,
    data: lifecycles,
    isFetching,
    setPageInfo,
  } = useControlledTable({
    useCount: useGetClientLifecycleCount as (props: unknown) => UseQueryResult,
    useGet: useGetClientLifecycle as (props: unknown) => UseQueryResult,
    countParams: { venueId, mac, sortInfo, fromDate, endDate, refreshId },
    getParams: { venueId, mac, sortInfo, fromDate, endDate, refreshId },
  });
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const { data: tableSpecs } = useGetClientLifecycleTableSpecs();

  const booleanCell = useCallback((cell, key) => <BooleanCell isTrue={cell.row.values[key]} key={uuid()} />, []);
  const dateCell = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);
  const dataCell = useCallback((cell, key) => <DataCell bytes={cell.row.values[key]} key={uuid()} />, []);
  const durationCell = useCallback(
    (cell, key, isMs = false) => (
      <DurationCell seconds={isMs ? Math.round(cell.row.values[key] / 1000) : cell.row.values[key]} key={uuid()} />
    ),
    [],
  );
  const dbCell = useCallback((cell, key) => <DecibelCell db={cell.row.values[key]} key={uuid()} />, []);
  const numberCell = useCallback((cell, key) => <NumberCell value={cell.row.values[key]} key={uuid()} />, []);

  const columns: Column[] = useMemo((): Column[] => {
    const cols: Column[] = [
      {
        id: 'timestamp',
        Header: t('common.timestamp'),
        Footer: '',
        accessor: 'timestamp',
        Cell: ({ cell }) => dateCell(cell, 'timestamp'),
        customMinWidth: '150px',
        customWidth: '150px',
        isMonospace: true,
      },
      {
        id: 'bssid',
        Header: 'BSSID',
        Footer: '',
        accessor: 'bssid',
        isMonospace: true,
      },
      {
        id: 'ssid',
        Header: 'SSID',
        Footer: '',
        accessor: 'ssid',
        isMonospace: true,
      },
      {
        id: 'rssi',
        Header: `RSSI (db)`,
        Footer: '',
        accessor: 'rssi',
        Cell: ({ cell }) => dbCell(cell, 'rssi'),
        isMonospace: true,
      },
      {
        id: 'noise',
        Header: `${t('analytics.noise')} (db)`,
        Footer: '',
        accessor: 'noise',
        Cell: ({ cell }) => dbCell(cell, 'noise'),
        isMonospace: true,
      },
      {
        id: 'channel',
        Header: t('analytics.channel'),
        Footer: '',
        accessor: 'channel',
        isMonospace: true,
      },
      {
        id: 'tx_power',
        Header: 'TX Power',
        Footer: '',
        accessor: 'tx_power',
        isMonospace: true,
      },
      {
        id: 'tx_retries',
        Header: `TX ${t('analytics.retries')}`,
        Footer: '',
        accessor: 'tx_retries',
        isMonospace: true,
      },
      {
        id: 'connected',
        Header: t('analytics.connected'),
        Footer: '',
        accessor: 'connected',
        Cell: ({ cell }) => durationCell(cell, 'connected'),
        customMinWidth: '150px',
        customWidth: '150px',
        isMonospace: true,
      },
      {
        id: 'inactive',
        Header: t('analytics.inactive'),
        Footer: '',
        accessor: 'inactive',
        Cell: ({ cell }) => durationCell(cell, 'inactive'),
        isMonospace: true,
      },
      {
        id: 'ack_signal',
        Header: `${t('analytics.ack_signal')} (db)`,
        Footer: '',
        accessor: 'ack_signal',
        Cell: ({ cell }) => dbCell(cell, 'ack_signal'),
        isMonospace: true,
      },
      {
        id: 'ack_signal_avg',
        Header: `${t('analytics.ack_signal')} ${t('common.avg')} (db)`,
        Footer: '',
        accessor: 'ack_signal_avg',
        Cell: ({ cell }) => dbCell(cell, 'ack_signal_avg'),
        isMonospace: true,
      },
      {
        id: 'rx_bytes',
        Header: 'RX',
        Footer: '',
        accessor: 'rx_bytes',
        Cell: ({ cell }) => dataCell(cell, 'rx_bytes'),
        isMonospace: true,
      },
      {
        id: 'rx_mcs',
        Header: 'RX MCS',
        Footer: '',
        accessor: 'rx_mcs',
        isMonospace: true,
      },
      {
        id: 'rx_nss',
        Header: 'RX NSS',
        Footer: '',
        accessor: 'rx_nss',
        isMonospace: true,
      },
      {
        id: 'tx_bytes',
        Header: 'TX',
        Footer: '',
        accessor: 'tx_bytes',
        Cell: ({ cell }) => dataCell(cell, 'tx_bytes'),
        isMonospace: true,
      },
      {
        id: 'tx_mcs',
        Header: 'TX MCS',
        Footer: '',
        accessor: 'tx_mcs',
        isMonospace: true,
      },
      {
        id: 'tx_nss',
        Header: 'TX NSS',
        Footer: '',
        accessor: 'tx_nss',
        isMonospace: true,
      },
      {
        id: 'rx_bitrate',
        Header: 'RX Bitrate',
        Footer: '',
        accessor: 'rx_bitrate',
        Cell: ({ cell }) => numberCell(cell, 'rx_bitrate'),
        isMonospace: true,
      },
      {
        id: 'rx_chwidth',
        Header: 'RX Ch Width',
        Footer: '',
        accessor: 'rx_chwidth',
        isMonospace: true,
      },
      {
        id: 'rx_duration',
        Header: 'RX Duration',
        Footer: '',
        accessor: 'rx_duration',
        Cell: ({ cell }) => durationCell(cell, 'rx_duration', true),
        isMonospace: true,
      },
      {
        id: 'rx_packets',
        Header: 'RX Packets',
        Footer: '',
        accessor: 'rx_packets',
        Cell: ({ cell }) => numberCell(cell, 'rx_packets'),
        isMonospace: true,
      },
      {
        id: 'rx_vht',
        Header: 'RX VHT',
        Footer: '',
        accessor: 'rx_vht',
        Cell: ({ cell }) => booleanCell(cell, 'rx_vht'),
        isMonospace: true,
      },
      {
        id: 'tx_bitrate',
        Header: 'TX Bitrate',
        Footer: '',
        accessor: 'tx_bitrate',
        Cell: ({ cell }) => numberCell(cell, 'tx_bitrate'),
        isMonospace: true,
      },
      {
        id: 'tx_chwidth',
        Header: 'TX Ch Width',
        Footer: '',
        accessor: 'tx_chwidth',
        isMonospace: true,
      },
      {
        id: 'tx_vht',
        Header: 'TX VHT',
        Footer: '',
        accessor: 'tx_vht',
        Cell: ({ cell }) => booleanCell(cell, 'tx_vht'),
        isMonospace: true,
      },
      {
        id: 'tx_duration',
        Header: 'TX Duration',
        Footer: '',
        accessor: 'tx_duration',
        Cell: ({ cell }) => durationCell(cell, 'tx_duration', true),
        isMonospace: true,
      },
      {
        id: 'tx_packets',
        Header: 'TX Packets',
        Footer: '',
        accessor: 'tx_packets',
        Cell: ({ cell }) => numberCell(cell, 'tx_packets'),
        isMonospace: true,
      },
      {
        id: 'ipv4',
        Header: 'IPv4',
        Footer: '',
        accessor: 'ipv4',
        isMonospace: true,
      },
      {
        id: 'ipv6',
        Header: 'IPv6',
        Footer: '',
        accessor: 'ipv6',
        isMonospace: true,
      },
      {
        id: 'channel_width',
        Header: 'Ch Width',
        Footer: '',
        accessor: 'channel_width',
        isMonospace: true,
      },
      {
        id: 'active_ms',
        Header: 'Active MS',
        Footer: '',
        accessor: 'active_ms',
        Cell: ({ cell }) => durationCell(cell, 'active_ms', true),
        isMonospace: true,
      },
      {
        id: 'busy_ms',
        Header: 'Busy MS',
        Footer: '',
        accessor: 'busy_ms',
        Cell: ({ cell }) => durationCell(cell, 'busy_ms', true),
        isMonospace: true,
      },
      {
        id: 'receive_ms',
        Header: 'Receive MS',
        Footer: '',
        accessor: 'receive_ms',
        Cell: ({ cell }) => durationCell(cell, 'receive_ms', true),
        isMonospace: true,
      },
      {
        id: 'mode',
        Header: t('analytics.mode'),
        Footer: '',
        accessor: 'mode',
        isMonospace: true,
      },
    ];
    return cols.map((col) => ({
      ...col,
      disableSortBy: tableSpecs ? !tableSpecs.find((spec: string) => spec === col.id) : true,
    }));
  }, [t, tableSpecs]);

  return (
    <>
      <Box my="10px" display="flex">
        <Box w="300px">{searchBar}</Box>
        <Spacer />
        <ColumnPicker
          columns={columns}
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
          preference="provisioning.clientLifecycle.hiddenColumns"
        />
        {timePickers}
      </Box>
      <Box overflowX="auto" w="100%">
        <SortableDataTable
          columns={
            columns as {
              id: string;
              Header: string;
              Footer: string;
              accessor: string;
            }[]
          }
          data={lifecycles ?? []}
          isLoading={isFetching}
          isManual
          hiddenColumns={hiddenColumns}
          obj={t('analytics.client_lifecycle')}
          count={count || 0}
          sortInfo={sortInfo}
          setSortInfo={setSortInfo}
          // @ts-ignore
          setPageInfo={setPageInfo}
          saveSettingsId="client_lifecycle.table"
          minHeight="166px"
        />
      </Box>
    </>
  );
};

export default ClientLifecyleTable;
