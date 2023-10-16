import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import GoogleOrionAccountActionCell from './ActionCell';
import CreateGoogleOrionAccountModal from './CreateGoogleOrionAccountModal';
import useGoogleOrionAccountModal from './DetailsModal/useEditModal';
import { DataGrid } from 'components/DataGrid';
import { DataGridColumn, useDataGrid } from 'components/DataGrid/useDataGrid';
import FormattedDate from 'components/FormattedDate';
import { GoogleOrionAccount, useGetGoogleOrionAccounts } from 'hooks/Network/GoogleOrion';

const dateCell = (date: number) => <FormattedDate date={date} key={uuid()} />;
const actionCell = (row: GoogleOrionAccount, open: (acc: GoogleOrionAccount) => void) => (
  <GoogleOrionAccountActionCell account={row} openDetailsModal={open} />
);

const GoogleOrionAccountTable = () => {
  const { t } = useTranslation();
  const detailsModal = useGoogleOrionAccountModal();
  const tableController = useDataGrid({
    tableSettingsId: 'provisioning.google_orion_roaming.table',
    defaultSortBy: [{ id: 'name', desc: false }],
    defaultOrder: ['name', 'modified', 'description', 'actions'],
  });
  const getAccounts = useGetGoogleOrionAccounts();

  const columns: DataGridColumn<GoogleOrionAccount>[] = React.useMemo(
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
      <DataGrid<GoogleOrionAccount>
        controller={tableController}
        header={{
          title: `${t('roaming.account', { count: getAccounts.data?.length ?? 0 })} ${
            getAccounts.data?.length ? `(${getAccounts.data.length})` : ''
          }`,
          objectListed: t('roaming.account_other'),
          addButton: <CreateGoogleOrionAccountModal />,
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

export default GoogleOrionAccountTable;
