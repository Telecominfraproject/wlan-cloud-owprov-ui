import React, { useCallback, useState } from 'react';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useTranslation } from 'react-i18next';
import { Box, Flex, FormControl, FormLabel, Switch, useBoolean, useDisclosure } from '@chakra-ui/react';
import {
  useGetInventoryCount,
  useGetInventoryTableSpecs,
  useGetInventoryTags,
  usePushConfig,
} from 'hooks/Network/Inventory';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import ColumnPicker from 'components/ColumnPicker';
import EditTagModal from 'components/Tables/InventoryTable/EditTagModal';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import CreateConfigurationModal from 'components/Tables/InventoryTable/CreateTagModal';
import EntityCell from 'components/TableCells/EntityCell';
import RefreshButton from 'components/Buttons/RefreshButton';
import DeviceSearchBar from 'components/SearchBars/DeviceSearch';
import { Device } from 'models/Device';
import { PageInfo, SortInfo } from 'models/Table';
import WifiScanModal from 'components/Modals/SubscriberDevice/WifiScanModal';
import FirmwareUpgradeModal from 'components/Modals/SubscriberDevice/FirmwareUpgradeModal';
import FactoryResetModal from 'components/Modals/SubscriberDevice/FactoryResetModal';
import VenueCell from 'components/TableCells/VenueCell';
import SortableDataTable from 'components/SortableDataTable';
import Actions from './Actions';

const InventoryTable: React.FC = () => {
  const { t } = useTranslation();
  const [pageInfo, setPageInfo] = useState<PageInfo | undefined>(undefined);
  const [onlyUnassigned, setOnlyUnassigned] = useBoolean(false);
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [tag, setTag] = useState<Device | { serialNumber: string } | undefined>(undefined);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isPushOpen, onOpen: openPush, onClose: closePush } = useDisclosure();
  const [sortInfo, setSortInfo] = useState<SortInfo>([{ id: 'serialNumber', sort: 'asc' }]);
  const { data: tableSpecs } = useGetInventoryTableSpecs();
  const scanModalProps = useDisclosure();
  const resetModalProps = useDisclosure();
  const upgradeModalProps = useDisclosure();
  const pushConfiguration = usePushConfig({ onSuccess: () => openPush() });
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const {
    data: count,
    isFetching: isFetchingCount,
    refetch: refetchCount,
  } = useGetInventoryCount({
    enabled: true,
    onlyUnassigned,
  });
  const {
    data: tags,
    isFetching: isFetchingTags,
    refetch: refetchTags,
  } = useGetInventoryTags({
    pageInfo,
    sortInfo,
    enabled: pageInfo !== null,
    count,
    onlyUnassigned,
  });
  const onOpenScan = (serial: string) => {
    setSerialNumber(serial);
    scanModalProps.onOpen();
  };
  const onOpenFactoryReset = (serial: string) => {
    setSerialNumber(serial);
    resetModalProps.onOpen();
  };
  const onOpenUpgradeModal = (serial: string) => {
    setSerialNumber(serial);
    upgradeModalProps.onOpen();
  };

  const openEditModal = (newTag: Device | { serialNumber: string }) => {
    setTag(newTag);
    openEdit();
  };

  const memoizedActions = useCallback(
    (cell) => (
      <Actions
        cell={cell.row}
        refreshTable={refetchCount}
        key={uuid()}
        openEditModal={openEditModal}
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
    ),
    [],
  );
  const memoizedDate = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);

  const entityCell = useCallback(
    (cell) => (
      <EntityCell entityName={cell.row.original.extendedInfo?.entity?.name ?? ''} entityId={cell.row.original.entity} />
    ),
    [],
  );
  const venueCell = useCallback(
    (cell) => (
      <VenueCell venueName={cell.row.original.extendedInfo?.venue?.name ?? ''} venueId={cell.row.original.venue} />
    ),
    [],
  );

  const onSearchClick = useCallback((serial: string) => {
    openEditModal({ serialNumber: serial });
  }, []);

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
        isMonospace: true,
      },
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        isMonospace: true,
      },
      {
        id: 'entity',
        Header: t('entities.one'),
        Footer: '',
        accessor: 'extendedInfo.entity.name',
        Cell: ({ cell }: { cell: unknown }) => entityCell(cell),
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        disableSortBy: true,
      },
      {
        id: 'venue',
        Header: t('venues.one'),
        Footer: '',
        accessor: 'extendedInfo.venue.name',
        Cell: ({ cell }: { cell: unknown }) => venueCell(cell),
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        disableSortBy: true,
      },
      {
        id: 'subscriber',
        Header: t('subscribers.one'),
        Footer: '',
        accessor: 'extendedInfo.subscriber.name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        disableSortBy: true,
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
        Cell: ({ cell }: { cell: unknown }) => memoizedDate(cell, 'modified'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }: { cell: unknown }) => memoizedActions(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ];

    return baseColumns.map((col) => {
      const lower = col.id.toLocaleLowerCase();
      return {
        ...col,
        disableSortBy: tableSpecs ? !tableSpecs.find((spec: string) => spec === lower) : true,
      };
    });
  }, [t, tableSpecs]);

  const onUnassignedToggle = () => {
    setOnlyUnassigned.toggle();
  };

  return (
    <>
      <Card>
        <CardHeader mb="10px">
          <Box w="300px">
            <DeviceSearchBar onClick={onSearchClick} />
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
              <RefreshButton onClick={refetchCount} isFetching={isFetchingCount || isFetchingTags} ml={2} />
            </Box>
          </Flex>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto" w="100%">
            <SortableDataTable
              columns={onlyUnassigned ? columns.filter((col) => col.id !== 'entity' && col.id !== 'venue') : columns}
              data={tags ?? []}
              isLoading={isFetchingCount || isFetchingTags}
              isManual
              sortInfo={sortInfo}
              setSortInfo={setSortInfo}
              hiddenColumns={hiddenColumns}
              obj={t('inventory.tags')}
              count={count || 0}
              setPageInfo={setPageInfo}
              fullScreen
              saveSettingsId="inventory.table"
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
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
      <ConfigurationPushModal isOpen={isPushOpen} onClose={closePush} pushResult={pushConfiguration.data} />
      <WifiScanModal modalProps={scanModalProps} serialNumber={serialNumber} />
      <FirmwareUpgradeModal modalProps={upgradeModalProps} serialNumber={serialNumber} />
      <FactoryResetModal modalProps={resetModalProps} serialNumber={serialNumber} />
    </>
  );
};

export default InventoryTable;
