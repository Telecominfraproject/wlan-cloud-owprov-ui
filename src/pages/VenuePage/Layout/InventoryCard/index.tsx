import * as React from 'react';
import { Box, Heading, Spacer, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import VenueInventoryActions from './Actions';
import { useVenueInventory } from './useVenueInventory';
import RefreshButton from 'components/Buttons/RefreshButton';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import DataTable from 'components/DataTable';
import ExportDevicesTableButton from 'components/ExportInventoryButton';
import FactoryResetModal from 'components/Modals/SubscriberDevice/FactoryResetModal';
import FirmwareUpgradeModal from 'components/Modals/SubscriberDevice/FirmwareUpgradeModal';
import WifiScanModal from 'components/Modals/SubscriberDevice/WifiScanModal';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import CreateTagModal from 'components/Tables/InventoryTable/CreateTagModal';
import EditTagModal from 'components/Tables/InventoryTable/EditTagModal';
import ImportDeviceCsvModal from 'components/Tables/InventoryTable/ImportDeviceCsvModal';
import { usePushConfig } from 'hooks/Network/Inventory';
import { Device } from 'models/Device';
import { InventoryTagApiResponse } from 'models/Inventory';
import { Column } from 'models/Table';

type Props = {
  id: string;
};

const VenueInventoryCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const { getVenue, getTags, setPageInfo } = useVenueInventory({ venueId: id });
  const queryClient = useQueryClient();
  const [tag, setTag] = React.useState<Device | undefined>(undefined);
  const [serialNumber, setSerialNumber] = React.useState<string>('');
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isPushOpen, onOpen: openPush, onClose: closePush } = useDisclosure();
  const scanModalProps = useDisclosure();
  const resetModalProps = useDisclosure();
  const upgradeModalProps = useDisclosure();
  const pushConfiguration = usePushConfig({ onSuccess: () => openPush() });

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
  const openEditModal = (newTag: Device) => {
    setTag(newTag);
    openEdit();
  };

  const actions = React.useCallback(
    (cell: { row: { original: Device } }) => (
      <VenueInventoryActions
        cell={cell.row}
        refreshEntity={getVenue.refetch}
        openEditModal={openEditModal}
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
    ),
    [],
  );

  const refetchTags = React.useCallback(() => {
    getVenue.refetch();
    queryClient.invalidateQueries(['get-inventory-with-select']);
  }, []);

  const columns: Column<InventoryTagApiResponse>[] = React.useMemo(
    () => [
      {
        id: 'serialNumber',
        Header: t('inventory.serial_number'),
        Footer: '',
        accessor: 'serialNumber',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        isMonospace: true,
        // @ts-ignore
        sortType: (rowA, rowB, currId) => {
          const a = rowA.values[currId];
          const b = rowB.values[currId];

          if (a && b) {
            return a.localeCompare(b);
          }

          return 0;
        },
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
        id: 'configuration',
        Header: t('configurations.one'),
        Footer: '',
        accessor: 'extendedInfo.deviceConfiguration.name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
      },
      {
        id: 'entity',
        Header: t('entities.entity'),
        Footer: '',
        accessor: 'extendedInfo.entity.name',
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
        id: 'actions',
        Header: '',
        Footer: '',
        accessor: 'id',
        // @ts-ignore
        Cell: (cell) => actions(cell),
        customWidth: '50px',
        disableSortBy: true,
      },
    ],
    [],
  );

  return (
    <Card>
      <CardHeader>
        <Heading size="md" my="auto">
          {t('inventory.title')}
        </Heading>
        <Spacer />
        <ExportDevicesTableButton serialNumbers={getVenue.data?.devices ?? []} />
        <ImportDeviceCsvModal refresh={getVenue.refetch} parent={{ venue: id }} deviceClass="venue" />
        <CreateTagModal refresh={getVenue.refetch} entityId={`venue:${id}`} deviceClass="venue" />
        <RefreshButton onClick={refetchTags} isFetching={getTags.isFetching} ml={2} />
      </CardHeader>
      <Box w="100%">
        <DataTable
          columns={columns.filter((col) => !['entity', 'venue', 'description'].find((ign) => col.id === ign))}
          data={getTags.data ?? []}
          isManual
          obj={t('devices.title')}
          sortBy={[
            {
              id: 'serialNumber',
              desc: false,
            },
          ]}
          count={getVenue.data?.devices.length ?? 0}
          setPageInfo={setPageInfo}
          minHeight="200px"
          onRowClick={openEditModal}
          isRowClickable={() => true}
          disabledPaginationAutoReset
        />
      </Box>
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
    </Card>
  );
};

export default VenueInventoryCard;
