import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { useGetResources } from 'hooks/Network/Resources';

const propTypes = {
  actions: PropTypes.func.isRequired,
  select: PropTypes.arrayOf(PropTypes.string).isRequired,
  refreshId: PropTypes.number.isRequired,
};

const ResourcesTable = ({ select, actions, refreshId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const {
    data: resources,
    isFetching,
    refetch,
  } = useGetResources({
    t,
    toast,
    select,
  });

  const dateCell = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);
  const prefixCell = useCallback((cell) => cell.row.values.variables[0]?.prefix ?? '-', []);

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        alwaysShow: true,
      },
      {
        id: 'variables',
        Header: t('common.variable'),
        Footer: '',
        accessor: 'variables',
        Cell: ({ cell }) => prefixCell(cell),
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'modified',
        Header: t('common.modified'),
        Footer: '',
        accessor: 'modified',
        Cell: ({ cell }) => dateCell(cell, 'modified'),
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
        accessor: 'id',
        customWidth: '80px',
        Cell: ({ cell }) => actions(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ];

    return baseColumns;
  }, [t]);

  useEffect(() => {
    if (refreshId > 0) refetch();
  }, [refreshId]);

  return (
    <DataTable
      columns={columns}
      data={resources ?? []}
      isLoading={isFetching}
      obj={t('resources.title')}
      minHeight="200px"
    />
  );
};

ResourcesTable.propTypes = propTypes;

export default ResourcesTable;
