import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Heading, useToast } from '@chakra-ui/react';
import { v4 as createUuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { ArrowsClockwise } from 'phosphor-react';
import ColumnPicker from 'components/ColumnPicker';
import { useGetSubscribers } from 'hooks/Network/Subscribers';
import useGetRequirements from 'hooks/Network/Requirements';
import CreateSubscriberModal from './CreateSubscriberModal';
import Actions from './Actions';

const propTypes = {
  title: PropTypes.string,
};

const defaultProps = {
  title: null,
};

const SubscribersTable = ({ title }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: requirements } = useGetRequirements();
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const { data: subscribers, refetch: refresh, isFetching } = useGetSubscribers({ t, toast });

  const memoizedActions = useCallback(
    (cell) => <Actions cell={cell.row} refreshTable={refresh} key={createUuid()} />,
    [],
  );
  const memoizedDate = useCallback(
    (cell, key) => <FormattedDate date={cell.row.values[key]} key={createUuid()} />,
    [],
  );

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'email',
        Header: t('users.login_id'),
        Footer: '',
        accessor: 'email',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        hasPopover: true,
        alwaysShow: true,
      },
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
        id: 'userRole',
        Header: t('users.role'),
        Footer: '',
        accessor: 'userRole',
        customMinWidth: '80px',
        customWidth: '80px',
      },
      {
        id: 'lastLogin',
        Header: t('users.last_login'),
        Footer: '',
        accessor: 'lastLogin',
        Cell: ({ cell }) => memoizedDate(cell, 'lastLogin'),
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
        id: 'user',
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
      <CardHeader mb="10px">
        <Box>
          <Heading size="md">{title}</Heading>
        </Box>
        <Flex w="100%" flexDirection="row" alignItems="center">
          <Box ms="auto">
            <ColumnPicker
              columns={columns}
              hiddenColumns={hiddenColumns}
              setHiddenColumns={setHiddenColumns}
              preference="provisioning.subscriberTable.hiddenColumns"
            />
            <CreateSubscriberModal refresh={refresh} requirements={requirements} />
            <Button
              colorScheme="gray"
              onClick={refresh}
              rightIcon={<ArrowsClockwise />}
              ml={2}
              isLoading={isFetching}
            >
              {t('common.refresh')}
            </Button>
          </Box>
        </Flex>
      </CardHeader>
      <CardBody>
        <Box overflowX="auto" w="100%">
          <DataTable
            columns={columns}
            data={subscribers ?? []}
            isLoading={isFetching}
            obj={t('subscribers.title')}
            hiddenColumns={hiddenColumns}
            fullScreen
          />
        </Box>
      </CardBody>
    </Card>
  );
};

SubscribersTable.propTypes = propTypes;
SubscribersTable.defaultProps = defaultProps;

export default SubscribersTable;
