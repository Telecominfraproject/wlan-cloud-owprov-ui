import React, { useCallback, useState } from 'react';
import { Box, FormControl, FormLabel, Switch, useBoolean, useDisclosure } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import Actions from './Actions';
import { DataGrid } from 'components/DataGrid';
import { DataGridColumn, useDataGrid } from 'components/DataGrid/useDataGrid';
import ExportDevicesTableButton from 'components/ExportInventoryButton';
import FormattedDate from 'components/FormattedDate';
import FactoryResetModal from 'components/Modals/SubscriberDevice/FactoryResetModal';
import FirmwareUpgradeModal from 'components/Modals/SubscriberDevice/FirmwareUpgradeModal';
import WifiScanModal from 'components/Modals/SubscriberDevice/WifiScanModal';
import DeviceSearchBar from 'components/SearchBars/DeviceSearch';
import EntityCell from 'components/TableCells/EntityCell';
import VenueCell from 'components/TableCells/VenueCell';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import CreateConfigurationModal from 'components/Tables/InventoryTable/CreateTagModal';
import EditTagModal from 'components/Tables/InventoryTable/EditTagModal';
import {
  useGetInventoryCount,
  useGetInventoryTableSpecs,
  useGetInventoryTags,
  usePushConfig,
} from 'hooks/Network/Inventory';
import { Device } from 'models/Device';
import { InventoryTagApiResponse } from 'models/Inventory';

const InventoryTable = () => {
  const { t } = useTranslation();
  const tableController = useDataGrid({
    tableSettingsId: 'provisioning.inventory.table',
    defaultSortBy: [{ id: 'serialNumber', desc: false }],
    defaultOrder: ['serialNumber', 'name', 'entity', 'venue', 'subscriber', 'description', 'modified', 'actions'],
  });
  const [onlyUnassigned, setOnlyUnassigned] = useBoolean(false);
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [tag, setTag] = useState<Device | { serialNumber: string } | undefined>(undefined);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isPushOpen, onOpen: openPush, onClose: closePush } = useDisclosure();
  const { data: tableSpecs } = useGetInventoryTableSpecs();
  const scanModalProps = useDisclosure();
  const resetModalProps = useDisclosure();
  const upgradeModalProps = useDisclosure();
  const pushConfiguration = usePushConfig({ onSuccess: () => openPush() });
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
    pageInfo: {
      limit: tableController.pageInfo.pageSize,
      index: tableController.pageInfo.pageIndex,
    },
    sortInfo: tableController.sortBy.map((sort) => ({
      id: sort.id,
      sort: sort.desc ? 'dsc' : 'asc',
    })),
    enabled: true,
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
    (cell: CellContext<InventoryTagApiResponse, unknown>) => (
      <Actions
        cell={cell.row as unknown as { original: Device }}
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
  const memoizedDate = useCallback(
    (cell: CellContext<InventoryTagApiResponse, unknown>, key: 'modified') => (
      <FormattedDate date={cell.row.original[key]} key={uuid()} />
    ),
    [],
  );

  const entityCell = useCallback(
    (cell: CellContext<InventoryTagApiResponse, unknown>) => (
      <EntityCell entityName={cell.row.original.extendedInfo?.entity?.name ?? ''} entityId={cell.row.original.entity} />
    ),
    [],
  );
  const venueCell = useCallback(
    (cell: CellContext<InventoryTagApiResponse, unknown>) => (
      <VenueCell venueName={cell.row.original.extendedInfo?.venue?.name ?? ''} venueId={cell.row.original.venue} />
    ),
    [],
  );

  const onSearchClick = useCallback((serial: string) => {
    openEditModal({ serialNumber: serial });
  }, []);

  const columns: DataGridColumn<InventoryTagApiResponse>[] = React.useMemo(() => {
    const baseColumns: DataGridColumn<InventoryTagApiResponse>[] = [
      {
        id: 'serialNumber',
        header: t('inventory.serial_number'),
        accessorKey: 'serialNumber',
        meta: {
          customMaxWidth: '200px',
          customWidth: 'calc(15vh)',
          customMinWidth: '150px',
          alwaysShow: true,
          isMonospace: true,
        },
      },
      {
        id: 'name',
        header: t('common.name'),
        accessorKey: 'name',
        meta: {
          customMaxWidth: '200px',
          customWidth: 'calc(15vh)',
          customMinWidth: '150px',
          isMonospace: true,
        },
      },
      {
        id: 'entity',
        header: t('entities.one'),
        accessorKey: 'extendedInfo.entity.name',
        cell: entityCell,
        enableSorting: false,
        meta: {
          customMaxWidth: '200px',
          customWidth: 'calc(15vh)',
          customMinWidth: '150px',
          stopPropagation: true,
        },
      },
      {
        id: 'venue',
        header: t('venues.one'),
        accessorKey: 'extendedInfo.venue.name',
        cell: venueCell,
        enableSorting: false,
        meta: {
          customMaxWidth: '200px',
          customWidth: 'calc(15vh)',
          customMinWidth: '150px',
          stopPropagation: true,
        },
      },
      {
        id: 'subscriber',
        header: t('subscribers.one'),
        accessorKey: 'extendedInfo.subscriber.name',
        enableSorting: true,
        meta: {
          customMaxWidth: '200px',
          customWidth: 'calc(15vh)',
          customMinWidth: '150px',
        },
      },
      {
        id: 'description',
        header: t('common.description'),
        accessorKey: 'description',
        enableSorting: false,
      },
      {
        id: 'modified',
        header: t('common.modified'),

        accessorKey: 'modified',
        cell: (cell) => memoizedDate(cell, 'modified'),
        meta: {
          customMinWidth: '150px',
          customWidth: '150px',
        },
      },
      {
        id: 'actions',
        header: t('common.actions'),
        accessorKey: 'Id',
        cell: memoizedActions,
        enableSorting: false,
        meta: {
          customWidth: '80px',
          alwaysShow: true,
        },
      },
    ];

    return baseColumns.map((col) => {
      const lower = col.id.toLocaleLowerCase();
      const isAlreadyDisabled = col.enableSorting === false;
      return {
        ...col,
        enableSorting: tableSpecs ? !!tableSpecs.find((spec: string) => spec === lower) : !isAlreadyDisabled,
      };
    });
  }, [t, tableSpecs]);

  const onUnassignedToggle = () => {
    setOnlyUnassigned.toggle();
  };

  return (
    <Box>
      <DataGrid<InventoryTagApiResponse>
        controller={tableController}
        header={{
          title: `${t('devices.title')} ${count ? `(${count})` : ''}`,
          objectListed: t('devices.title'),
          otherButtons: (
            <>
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
              <ExportDevicesTableButton />
            </>
          ),
          addButton: <CreateConfigurationModal refresh={refetchCount} />,
          leftContent: <DeviceSearchBar onClick={onSearchClick} />,
        }}
        columns={onlyUnassigned ? columns.filter((col) => col.id !== 'entity' && col.id !== 'venue') : columns}
        data={tags}
        isLoading={isFetchingCount || isFetchingTags}
        options={{
          count,
          isManual: true,
          onRowClick: (device) => () => openEditModal(device),
          refetch: refetchCount,
          minimumHeight: '200px',
          showAsCard: true,
        }}
      />
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
    </Box>
  );
};

export default InventoryTable;
