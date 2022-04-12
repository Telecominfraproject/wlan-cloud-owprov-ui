import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import useFreeTable from 'hooks/useFreeTable';
import { useGetServiceClasses } from 'hooks/Network/ServiceClasses';

const propTypes = {
  operatorId: PropTypes.string.isRequired,
  refreshId: PropTypes.number.isRequired,
  actions: PropTypes.func.isRequired,
};

const ServiceClassTable = ({ operatorId, refreshId, actions }) => {
  const { t } = useTranslation();
  const {
    data: serviceClasses,
    isFetching,
    refetch,
  } = useFreeTable({ useGet: useGetServiceClasses, params: { operatorId } });

  const actionsCell = useCallback((cell) => actions(cell), []);
  const dateCell = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);
  const costCell = useCallback(
    (cell) => `${cell.row.original.cost} ${cell.row.original.currency} / ${cell.row.original.period}`,
    [],
  );

  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'cost',
        Header: t('service.cost'),
        Footer: '',
        accessor: 'cost',
        Cell: ({ cell }) => costCell(cell, 'modified'),
        customMinWidth: '150px',
        customWidth: '150px',
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
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }) => actionsCell(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ];

    return baseColumns;
  }, []);

  useEffect(() => {
    if (refreshId > 0) refetch();
  }, [refreshId]);
  return (
    <DataTable
      columns={columns}
      data={serviceClasses ?? []}
      obj={t('service.other')}
      isLoading={isFetching}
      minHeight="200px"
    />
  );
};

ServiceClassTable.propTypes = propTypes;
export default ServiceClassTable;
