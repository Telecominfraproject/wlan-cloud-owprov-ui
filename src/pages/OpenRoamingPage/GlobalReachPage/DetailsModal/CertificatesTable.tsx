import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import GlobalReachCertActionCell from './ActionCell';
import CreateGlobalReachCertificateButton from './AddButton';
import CopyCell from './CopyCell';
import { DataGrid } from 'components/DataGrid';
import { DataGridColumn, useDataGrid } from 'components/DataGrid/useDataGrid';
import FormattedDate from 'components/FormattedDate';
import { GlobalReachAccount, GlobalReachCertificate, useGetGlobalReachCertificates } from 'hooks/Network/GlobalReach';

const dateCell = (date: number) => <FormattedDate date={date} key={uuid()} />;
const copyCell = (value: string) => <CopyCell value={value} key={uuid()} isCompact />;
const actionCell = (row: GlobalReachCertificate) => <GlobalReachCertActionCell certificate={row} />;

type Props = {
  account: GlobalReachAccount;
  isSubTable?: boolean;
};

const CertificatesTable = ({ account, isSubTable }: Props) => {
  const { t } = useTranslation();
  const getCertificates = useGetGlobalReachCertificates(account.id);
  const tableController = useDataGrid({
    tableSettingsId: 'provisioning.global_reach_roaming_certs.table',
    defaultSortBy: [{ id: 'name', desc: false }],
    defaultOrder: [
      'name',
      'created',
      'expiresAt',
      'csr',
      'certificate',
      'certificateChain',
      'certificateId',
      'actions',
    ],
  });

  const columns: DataGridColumn<GlobalReachCertificate>[] = React.useMemo(
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
        id: 'expires',
        header: 'Expires',

        accessorKey: 'created',
        cell: (cell) => dateCell(cell.row.original.expiresAt),
        meta: {
          customMinWidth: '150px',
          customWidth: '150px',
        },
      },
      {
        id: 'csr',
        header: 'CSR',
        accessorKey: 'csr',
        cell: (cell) => copyCell(cell.row.original.csr),
        meta: {
          customMaxWidth: '50px',
          customWidth: '50px',
          customMinWidth: '50px',
        },
      },
      {
        id: 'certificate',
        header: 'Cert',
        accessorKey: 'certificate',
        cell: (cell) => copyCell(cell.row.original.certificate),
        meta: {
          customMaxWidth: '60px',
          customWidth: '60px',
          customMinWidth: '60px',
        },
      },
      {
        id: 'certificateChain',
        header: 'Cert Chain',
        accessorKey: 'certificateChain',
        cell: (cell) => copyCell(cell.row.original.certificateChain),
        meta: {
          customMaxWidth: '120px',
          customWidth: '120px',
          customMinWidth: '120px',
        },
      },
      {
        id: 'actions',
        header: '',
        accessorKey: 'id',
        cell: (cell) => actionCell(cell.row.original),
        enableSorting: false,
        meta: {
          customWidth: '10px',
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
    <DataGrid<GlobalReachCertificate>
      controller={tableController}
      header={{
        title: isSubTable
          ? ''
          : `${t('roaming.certificate', { count: getCertificates.data?.length ?? 0 })} ${
              getCertificates.data?.length ? `(${getCertificates.data.length})` : ''
            }`,
        objectListed: t('roaming.certificate_other'),
        addButton: isSubTable ? null : <CreateGlobalReachCertificateButton account={account} />,
      }}
      columns={isSubTable ? columns.filter(({ id }) => id !== 'actions') : columns}
      data={getCertificates.data ?? []}
      isLoading={getCertificates.isFetching}
      options={{
        count: getCertificates.data?.length ?? 0,
        // onRowClick: (device) => () => detailsModal.openModal(device),
        refetch: getCertificates.refetch,
        minimumHeight: '200px',
      }}
    />
  );
};

export default CertificatesTable;
