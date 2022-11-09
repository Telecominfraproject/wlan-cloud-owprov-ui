import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Actions from './Actions';
import { ConfigurationOverride } from 'hooks/Network/ConfigurationOverride';
import useFastField from 'hooks/useFastField';
import { Column } from 'models/Table';

type Props = {
  serialNumber: string;
  isDisabled?: boolean;
};

const useConfigurationOverridesTable = ({ isDisabled }: Props) => {
  const { t } = useTranslation();
  const hiddenColumns = React.useState<string[]>([]);
  const { value } = useFastField<ConfigurationOverride[] | undefined>({ name: 'overrides' });

  const overrides: ConfigurationOverride[] = value || [];

  const actionCell = React.useCallback(
    (override: ConfigurationOverride) => <Actions override={override} isDisabled={isDisabled} />,
    [isDisabled],
  );

  const columns: Column<ConfigurationOverride>[] = React.useMemo(
    (): Column<ConfigurationOverride>[] => [
      {
        id: 'source',
        Header: t('overrides.source'),
        Footer: '',
        accessor: 'source',
        alwaysShow: true,
        customWidth: '120px',
      },
      {
        id: 'parameterName',
        Header: t('common.name'),
        Footer: '',
        accessor: 'parameterName',
        alwaysShow: true,
        customWidth: '120px',
      },
      {
        id: 'parameterValue',
        Header: t('overrides.value'),
        Footer: '',
        accessor: 'parameterValue',
        alwaysShow: true,
        customWidth: '120px',
      },
      {
        id: 'reason',
        Header: t('overrides.reason'),
        Footer: '',
        accessor: 'reason',
      },
      {
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        Cell: (v) => actionCell(v.cell.row.original),
        disableSortBy: true,
        customWidth: '120px',
        alwaysShow: true,
      },
    ],
    [t, isDisabled],
  );

  return React.useMemo(
    () => ({
      overrides,
      columns,
      hiddenColumns,
    }),
    [overrides, columns, hiddenColumns],
  );
};

export default useConfigurationOverridesTable;
