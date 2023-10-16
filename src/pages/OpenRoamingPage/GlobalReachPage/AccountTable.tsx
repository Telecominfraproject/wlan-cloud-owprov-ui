import * as React from 'react';
import { State } from 'country-state-city';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import ActionCell from './ActionCell';
import CreateGlobalReachAccountModal from './CreateGlobalReachAccountModal';
import useGlobalAccountModal from './DetailsModal/useEditModal';
import { DataGrid } from 'components/DataGrid';
import { DataGridColumn, useDataGrid } from 'components/DataGrid/useDataGrid';
import FormattedDate from 'components/FormattedDate';
import COUNTRY_LIST from 'constants/countryList';
import { GlobalReachAccount, useGetGlobalReachAccounts } from 'hooks/Network/GlobalReach';

const dateCell = (date: number) => <FormattedDate date={date} key={uuid()} />;
const actionCell = (row: GlobalReachAccount, open: (acc: GlobalReachAccount) => void) => (
  <ActionCell account={row} openDetailsModal={open} />
);
const countryCell = (row: GlobalReachAccount) => {
  const found = COUNTRY_LIST.find((c) => c.value === row.country);

  return found?.label ?? row.country;
};
const provinceCell = (row: GlobalReachAccount) => {
  const found = State.getStateByCodeAndCountry(row.province, row.country);

  return found?.name ?? row.province;
};

const GlobalReachAccountTable = () => {
  const { t } = useTranslation();
  const detailsModal = useGlobalAccountModal();
  const tableController = useDataGrid({
    tableSettingsId: 'provisioning.global_reach_roaming.table',
    defaultSortBy: [{ id: 'name', desc: false }],
    defaultOrder: [
      'name',
      'modified',
      'country',
      'province',
      'city',
      'organization',
      'commonName',
      'description',
      'actions',
    ],
  });
  const getAccounts = useGetGlobalReachAccounts();

  const columns: DataGridColumn<GlobalReachAccount>[] = React.useMemo(
    () => [
      {
        id: 'name',
        header: t('common.name'),
        accessorKey: 'name',
        meta: {
          customMaxWidth: '200px',
          customWidth: 'calc(15vh)',
          customMinWidth: '150px',
          anchored: true,
          alwaysShow: true,
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
        id: 'country',
        header: t('roaming.country'),
        accessorKey: 'country',
        cell: (cell) => countryCell(cell.row.original),
        meta: {
          customMinWidth: '100px',
          customWidth: '100px',
        },
      },
      {
        id: 'province',
        header: t('roaming.province'),
        accessorKey: 'province',
        cell: (cell) => provinceCell(cell.row.original),
        meta: {
          customMinWidth: '100px',
          customWidth: '100px',
        },
      },
      {
        id: 'city',
        header: t('roaming.city'),
        accessorKey: 'city',
        meta: {
          customMinWidth: '100px',
          customWidth: '100px',
        },
      },
      {
        id: 'organization',
        header: t('roaming.organization'),
        accessorKey: 'organization',
        meta: {
          customMinWidth: '100px',
          customWidth: '100px',
        },
      },
      {
        id: 'commonName',
        header: t('roaming.common_name'),
        accessorKey: 'commonName',
        meta: {
          customMinWidth: '100px',
          customWidth: '100px',
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
        cell: (cell) => actionCell(cell.row.original, detailsModal.openModal),
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
      {detailsModal.modal}
      <DataGrid<GlobalReachAccount>
        controller={tableController}
        header={{
          title: `${t('roaming.account', { count: getAccounts.data?.length ?? 0 })} ${
            getAccounts.data?.length ? `(${getAccounts.data.length})` : ''
          }`,
          objectListed: t('roaming.account_other'),
          addButton: <CreateGlobalReachAccountModal />,
        }}
        columns={columns}
        data={getAccounts.data ?? []}
        isLoading={getAccounts.isFetching}
        options={{
          count: getAccounts.data?.length ?? 0,
          onRowClick: (device) => () => detailsModal.openModal(device),
          refetch: getAccounts.refetch,
          minimumHeight: '200px',
          showAsCard: true,
        }}
      />
    </>
  );
};

export default GlobalReachAccountTable;
