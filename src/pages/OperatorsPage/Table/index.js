import React, { useCallback, useMemo, useState } from 'react';
import DataTable from 'components/DataTable';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Spacer } from '@chakra-ui/react';
import { useGetOperatorCount, useGetOperators } from 'hooks/Network/Operators';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import ColumnPicker from 'components/ColumnPicker';
import CreateOperatorModal from 'components/Modals/Operator/CreateOperatorModal';
import RefreshButton from 'components/Buttons/RefreshButton';
import useControlledTable from 'hooks/useControlledTable';
import Actions from './Actions';

const OperatorsTable = () => {
  const { t } = useTranslation();
  const {
    count,
    data: operators,
    isFetching,
    setPageInfo,
    refetchCount,
  } = useControlledTable({ useCount: useGetOperatorCount, useGet: useGetOperators });
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const memoizedActions = useCallback(
    (cell) => <Actions cell={cell.row} refreshTable={refetchCount} key={uuid()} />,
    [],
  );
  const memoizedDate = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);

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
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
        disableSortBy: true,
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
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }) => memoizedActions(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ];

    return baseColumns;
  }, []);

  return (
    <Card>
      <CardHeader mb="10px" display="flex">
        <Heading size="md" mt={1}>{`${count ?? 0} ${t('operator.operator', { count: count ?? 0 })}`}</Heading>
        <Spacer />
        <Flex flexDirection="row" alignItems="center">
          <Box ms="auto" display="flex">
            <ColumnPicker
              columns={columns}
              hiddenColumns={hiddenColumns}
              setHiddenColumns={setHiddenColumns}
              preference="provisioning.operatorTable.hiddenColumns"
            />
            <CreateOperatorModal refresh={refetchCount} />
            <RefreshButton onClick={refetchCount} isLoading={isFetching} ml={2} />
          </Box>
        </Flex>
      </CardHeader>
      <CardBody>
        <Box overflowX="auto" w="100%">
          <DataTable
            columns={columns}
            data={operators ?? []}
            isLoading={isFetching}
            isManual
            hiddenColumns={hiddenColumns}
            obj={t('operator.other')}
            count={count || 0}
            setPageInfo={setPageInfo}
            fullScreen
            saveSettingsId="operators.table"
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default OperatorsTable;
