import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { useGetSelectVenues } from 'hooks/Network/Venues';

const propTypes = {
  actions: PropTypes.func.isRequired,
  select: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const VenueTable = ({ actions, select }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: venues, isFetching } = useGetSelectVenues({ t, toast, select });

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
  }, []);

  return (
    <DataTable
      h="100%"
      columns={columns}
      data={venues ?? []}
      isLoading={isFetching}
      obj={t('venues.title')}
      minHeight="200px"
    />
  );
};

VenueTable.propTypes = propTypes;

export default VenueTable;
