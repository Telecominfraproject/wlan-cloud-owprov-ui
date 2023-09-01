import * as React from 'react';
import { Box, Heading, Spacer, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import EntityInventoryActions from './Actions';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import ExportDevicesTableButton from 'components/ExportInventoryButton';
import FactoryResetModal from 'components/Modals/SubscriberDevice/FactoryResetModal';
import FirmwareUpgradeModal from 'components/Modals/SubscriberDevice/FirmwareUpgradeModal';
import WifiScanModal from 'components/Modals/SubscriberDevice/WifiScanModal';
import InventoryTable from 'components/Tables/InventoryTable';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import CreateTagModal from 'components/Tables/InventoryTable/CreateTagModal';
import EditTagModal from 'components/Tables/InventoryTable/EditTagModal';
import ImportDeviceCsvModal from 'components/Tables/InventoryTable/ImportDeviceCsvModal';
import { useGetEntity } from 'hooks/Network/Entity';
import { usePushConfig } from 'hooks/Network/Inventory';
import { Device } from 'models/Device';

type Props = {
  id: string;
};

const EntityInventoryCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const getEntity = useGetEntity({ id });
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
      <EntityInventoryActions
        cell={cell.row}
        refreshEntity={getEntity.refetch}
        openEditModal={openEditModal}
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
    ),
    [],
  );

  const refetchTags = React.useCallback(() => {
    queryClient.invalidateQueries(['get-inventory-with-select']);
  }, []);

  return (
    <Card>
      <CardHeader>
        <Heading size="md" my="auto">
          {t('inventory.title')}
        </Heading>
        <Spacer />
        <ExportDevicesTableButton serialNumbers={getEntity.data?.devices ?? []} />
        <ImportDeviceCsvModal
          refresh={getEntity.refetch}
          parent={{ entity: getEntity.data?.id }}
          deviceClass="entity"
        />
        <CreateTagModal refresh={getEntity.refetch} entityId={`entity:${getEntity.data?.id}`} deviceClass="entity" />
      </CardHeader>
      <Box overflowX="auto">
        <InventoryTable
          tagSelect={getEntity.data?.devices ?? []}
          ignoredColumns={['entity', 'venue', 'description']}
          actions={actions}
          openDetailsModal={openEditModal}
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

export default EntityInventoryCard;
