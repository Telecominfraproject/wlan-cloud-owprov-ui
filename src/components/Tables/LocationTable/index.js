import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { useGetSelectLocations } from 'hooks/Network/Locations';

const propTypes = {
  actions: PropTypes.func.isRequired,
  select: PropTypes.arrayOf(PropTypes.string).isRequired,
  ignoredColumns: PropTypes.arrayOf(PropTypes.string),
  refreshId: PropTypes.number,
  disabledIds: PropTypes.arrayOf(PropTypes.string),
};
const defaultProps = {
  ignoredColumns: [],
  refreshId: 0,
  disabledIds: [],
};

const LocationTable = ({ actions, select, refreshId, ignoredColumns, disabledIds }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: venues, isFetching, refetch } = useGetSelectLocations({ t, toast, select });

  const memoizedDate = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);

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
      },
      {
        id: 'entity',
        Header: t('entities.one'),
        Footer: '',
        accessor: 'extendedInfo.entity.name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'country',
        Header: t('locations.country'),
        Footer: '',
        accessor: 'country',
        customWidth: '100px',
      },
      {
        id: 'created',
        Header: t('common.created'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }) => memoizedDate(cell, 'created'),
        customMinWidth: '150px',
        customWidth: '150px',
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
        id: 'id',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }) => actions(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ];

    return baseColumns;
  }, [t, disabledIds]);

  useEffect(() => {
    if (refreshId > 0) refetch();
  }, [refreshId]);

  return (
    <DataTable
      columns={columns.filter((col) => !ignoredColumns.find((ignored) => ignored === col.id))}
      data={venues ?? []}
      isLoading={isFetching}
      obj={t('locations.other')}
      minHeight="200px"
    />
  );
};

LocationTable.propTypes = propTypes;
LocationTable.defaultProps = defaultProps;

export default LocationTable;
