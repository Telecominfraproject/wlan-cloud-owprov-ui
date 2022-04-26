import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { compactDate } from 'utils/dateFormatting';
import DataTable from 'components/DataTable';
import { Column } from 'models/Table';

interface Props {
  certificates?: { expiresOn: number; filename: string }[];
}

const defaultProps = {
  certificates: [],
};

const SystemCertificatesTable: React.FC<Props> = ({ certificates }) => {
  const { t } = useTranslation();

  const memoizedExpiry = useCallback((cell) => compactDate(cell.row.values.expiresOn), []);

  const columns = React.useMemo(
    (): Column[] => [
      {
        id: 'expiresOn',
        Header: t('certificates.expires_on'),
        Footer: '',
        accessor: 'expiresOn',
        Cell: ({ cell }: { cell: unknown }) => memoizedExpiry(cell),
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        hasPopover: true,
      },
      {
        id: 'filename',
        Header: t('certificates.filename'),
        Footer: '',
        accessor: 'filename',
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={certificates ?? []}
      obj={t('certificates.title')}
      hideControls
      sortBy={[
        {
          id: 'started',
          desc: true,
        },
      ]}
    />
  );
};

SystemCertificatesTable.defaultProps = defaultProps;
export default SystemCertificatesTable;
