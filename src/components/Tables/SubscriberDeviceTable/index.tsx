import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import DataTable from 'components/DataTable';
import FormattedDate from 'components/FormattedDate';
import { useGetSubscriberDevices } from 'hooks/Network/SubscriberDevices';
import { Device } from 'models/Device';
import { Column, DeviceCell } from 'models/Table';

interface Props {
  actions: (cell: DeviceCell) => React.ReactElement;
  onOpenDetails: (device: Device) => void;
  operatorId: string;
  subscriberId?: string;
  setDevices?: React.Dispatch<React.SetStateAction<Device[]>>;
  ignoredColumns?: string[];
  refreshId?: number;
  disabledIds?: string[];
  minHeight?: string;
}

const defaultProps = {
  setDevices: undefined,
  ignoredColumns: [],
  refreshId: 0,
  disabledIds: [],
  minHeight: undefined,
};

const SubscriberDeviceTable: React.FC<Props> = ({
  actions,
  operatorId,
  onOpenDetails,
  subscriberId = '',
  setDevices,
  ignoredColumns,
  refreshId,
  disabledIds,
  minHeight,
}) => {
  const { t } = useTranslation();
  const { data: subscriberDevices, isFetching, refetch } = useGetSubscriberDevices({ operatorId, subscriberId });

  const actionCell = useCallback((cell) => actions(cell), [actions]);
  const memoizedDate = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(
    (): Column<Device>[] => [
      {
        id: 'serialNumber',
        Header: t('inventory.serial_number'),
        Footer: '',
        accessor: 'serialNumber',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        isMonospace: true,
      },
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        isMonospace: true,
      },
      {
        id: 'contact-email',
        Header: t('contacts.one'),
        Footer: '',
        accessor: 'contact.primaryEmail',
        customMinWidth: '250px',
        customWidth: '250px',
      },
      {
        id: 'modified',
        Header: t('common.modified'),
        Footer: '',
        accessor: 'modified',
        Cell: ({ cell }) => memoizedDate(cell, 'modified'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
        disableSortBy: true,
      },
      {
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }) => actionCell(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ],
    [t, disabledIds, actionCell],
  );

  useEffect(() => {
    if (setDevices) setDevices(subscriberDevices ?? []);
  }, [subscriberDevices]);

  useEffect(() => {
    if (refreshId !== undefined && refreshId > 0) refetch();
  }, [refreshId]);

  return (
    <DataTable
      columns={
        ignoredColumns ? columns.filter((col) => !ignoredColumns.find((ignored) => ignored === col.id)) : columns
      }
      data={subscriberDevices ?? []}
      isLoading={isFetching}
      obj={t('devices.title')}
      sortBy={[
        {
          id: 'serialNumber',
          desc: false,
        },
      ]}
      minHeight={minHeight ?? '200px'}
      onRowClick={onOpenDetails}
      isRowClickable={() => true}
    />
  );
};

SubscriberDeviceTable.defaultProps = defaultProps;
export default SubscriberDeviceTable;
