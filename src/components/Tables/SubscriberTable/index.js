import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import useControlledTable from 'hooks/useControlledTable';
import { useGetSubscriberCount, useGetSubscribers } from 'hooks/Network/Subscribers';

const propTypes = {
  actions: PropTypes.func.isRequired,
  operatorId: PropTypes.string.isRequired,
  refreshId: PropTypes.number,
  disabledIds: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  refreshId: 0,
  disabledIds: [],
};

const SubscriberTable = ({ actions, operatorId, refreshId, disabledIds }) => {
  const { t } = useTranslation();
  const {
    count,
    data: subscribers,
    isFetching,
    setPageInfo,
    refetchData,
  } = useControlledTable({
    useCount: useGetSubscriberCount,
    useGet: useGetSubscribers,
    countParams: { operatorId },
    getParams: { operatorId },
  });

  const actionCell = useCallback((cell) => actions(cell), [actions]);
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
        id: 'email',
        Header: t('common.email'),
        Footer: '',
        accessor: 'email',
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
        id: 'locale',
        Header: t('common.locale'),
        Footer: '',
        accessor: 'locale',
        customWidth: '100px',
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
  }, [t, disabledIds, actionCell]);

  useEffect(() => {
    if (refreshId > 0) refetchData();
  }, [refreshId]);

  return (
    <DataTable
      columns={columns}
      data={subscribers ?? []}
      isLoading={isFetching}
      isManual
      obj={t('subscribers.other')}
      count={count || 0}
      setPageInfo={setPageInfo}
      saveSettingsId="operator.subscribers.table"
      minHeight="200px"
    />
  );
};

SubscriberTable.propTypes = propTypes;
SubscriberTable.defaultProps = defaultProps;

export default SubscriberTable;
