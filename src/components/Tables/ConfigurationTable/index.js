import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { useGetSelectConfigurations } from 'hooks/Network/Configurations';

const propTypes = {
  select: PropTypes.arrayOf(PropTypes.string).isRequired,
  actions: PropTypes.func.isRequired,
};

const ConfigurationsTable = ({ select, actions }) => {
  const { t } = useTranslation();
  const { data: configurations, isFetching } = useGetSelectConfigurations({ select });

  const dateCell = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);
  const typesCell = useCallback((cell) => cell.row.values.deviceTypes.join(', '), []);

  // Columns array. This array contains your table headings and accessors which maps keys from data array
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
        alwaysShow: true,
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
        disableSortBy: true,
      },
      {
        id: 'created',
        Header: t('common.created'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }) => dateCell(cell, 'created'),
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
        id: 'deviceTypes',
        Header: t('configurations.device_types'),
        Footer: '',
        accessor: 'deviceTypes',
        Cell: ({ cell }) => typesCell(cell),
        disableSortBy: true,
        customMaxWidth: '150px',
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
  }, [t]);

  return (
    <DataTable
      h="100%"
      columns={columns}
      data={configurations ?? []}
      isLoading={isFetching}
      obj={t('configurations.title')}
      minHeight="200px"
    />
  );
};

ConfigurationsTable.propTypes = propTypes;

export default ConfigurationsTable;
