import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  useBoolean,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useGetInventoryCount, useGetInventoryTags, usePushConfig } from 'hooks/Network/Inventory';
import { v4 as createUuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import ColumnPicker from 'components/ColumnPicker';
import EditTagModal from 'components/Tables/InventoryTable/EditTagModal';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import CreateConfigurationModal from 'components/Tables/InventoryTable/CreateTagModal';
import EntityCell from 'components/TableCells/EntityCell';
import RefreshButton from 'components/Buttons/RefreshButton';
import Actions from './Actions';

const propTypes = {
  title: PropTypes.string,
};

const defaultProps = {
  title: null,
};

const InventoryTable = ({ title }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [pageInfo, setPageInfo] = useState(null);
  const [onlyUnassigned, setOnlyUnassigned] = useBoolean(false);
  const [tag, setTag] = useState(null);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isPushOpen, onOpen: openPush, onClose: closePush } = useDisclosure();
  const pushConfiguration = usePushConfig({ t, toast, onSuccess: () => openPush() });
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const {
    data: count,
    isFetching: isFetchingCount,
    refetch: refetchCount,
  } = useGetInventoryCount({
    t,
    toast,
    onlyUnassigned,
  });
  const {
    data: tags,
    isFetching: isFetchingTags,
    refetch: refetchTags,
  } = useGetInventoryTags({
    t,
    toast,
    pageInfo,
    enabled: pageInfo !== null,
    count,
    onlyUnassigned,
  });

  const openEditModal = (newTag) => {
    setTag(newTag);
    openEdit();
  };

  const memoizedActions = useCallback(
    (cell) => (
      <Actions
        cell={cell.row}
        refreshTable={refetchCount}
        key={createUuid()}
        openEditModal={openEditModal}
      />
    ),
    [],
  );
  const memoizedDate = useCallback(
    (cell, key) => <FormattedDate date={cell.row.values[key]} key={createUuid()} />,
    [],
  );

  const entityCell = useCallback(
    (cell) => (
      <EntityCell
        entityName={cell.row.original.extendedInfo?.entity?.name ?? ''}
        entityId={cell.row.original.entity}
      />
    ),
    [],
  );

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'serialNumber',
        Header: t('inventory.serial_number'),
        Footer: '',
        accessor: 'serialNumber',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
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
        id: 'entity',
        Header: t('entities.one'),
        Footer: '',
        accessor: 'extendedInfo.entity.name',
        Cell: ({ cell }) => entityCell(cell),
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'venue',
        Header: t('venues.one'),
        Footer: '',
        accessor: 'extendedInfo.venue.name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'subscriber',
        Header: t('subscribers.one'),
        Footer: '',
        accessor: 'extendedInfo.subscriber.name',
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
        id: 'created',
        Header: t('common.created'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }) => memoizedDate(cell, 'created'),
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
  }, [onlyUnassigned]);

  const onUnassignedToggle = () => {
    setOnlyUnassigned.toggle();
  };

  return (
    <>
      <Card>
        <CardHeader mb="10px">
          <Box>
            <Heading size="md">{title}</Heading>
          </Box>
          <Flex w="100%" flexDirection="row" alignItems="center">
            <Box ms="auto" display="flex">
              <FormControl display="flex" w="unset" alignItems="center" mr={2}>
                <FormLabel htmlFor="unassigned-switch" mb="0">
                  {t('devices.unassigned_only')}
                </FormLabel>
                <Switch
                  id="unassigned-switch"
                  defaultChecked={onlyUnassigned}
                  onChange={onUnassignedToggle}
                  size="lg"
                />
              </FormControl>
              <ColumnPicker
                columns={columns}
                hiddenColumns={hiddenColumns}
                setHiddenColumns={setHiddenColumns}
                preference="provisioning.inventoryTable.hiddenColumns"
              />
              <CreateConfigurationModal refresh={refetchCount} />
              <RefreshButton
                onClick={refetchCount}
                isLoading={isFetchingCount || isFetchingTags}
                ml={2}
              />
            </Box>
          </Flex>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto" w="100%">
            <DataTable
              columns={
                onlyUnassigned
                  ? columns.filter((col) => col.id !== 'entity' && col.id !== 'venue')
                  : columns
              }
              data={tags ?? []}
              isLoading={isFetchingCount || isFetchingTags}
              isManual
              hiddenColumns={hiddenColumns}
              obj={t('inventory.tags')}
              count={count || 0}
              setPageInfo={setPageInfo}
              fullScreen
            />
          </Box>
        </CardBody>
      </Card>
      <EditTagModal
        isOpen={isEditOpen}
        onClose={closeEdit}
        tag={tag}
        refresh={refetchTags}
        pushConfig={pushConfiguration}
      />
      <ConfigurationPushModal
        isOpen={isPushOpen}
        onClose={closePush}
        pushResult={pushConfiguration.data}
      />
    </>
  );
};

InventoryTable.propTypes = propTypes;
InventoryTable.defaultProps = defaultProps;

export default InventoryTable;
