import React, { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import InventoryTable from 'components/Tables/InventoryTable';
import { Box, useDisclosure } from '@chakra-ui/react';
import { usePushConfig } from 'hooks/Network/Inventory';
import { useQueryClient } from 'react-query';
import EditTagModal from 'components/Tables/InventoryTable/EditTagModal';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import CreateTagModal from 'components/Tables/InventoryTable/CreateTagModal';
import ImportDeviceCsvModal from 'components/Tables/InventoryTable/ImportDeviceCsvModal';
import WifiScanModal from 'components/Modals/SubscriberDevice/WifiScanModal';
import FirmwareUpgradeModal from 'components/Modals/SubscriberDevice/FirmwareUpgradeModal';
import FactoryResetModal from 'components/Modals/SubscriberDevice/FactoryResetModal';
import { Entity } from 'models/Entity';
import { Device } from 'models/Device';
import Actions from './Actions';

interface Props {
  entity: Entity;
}

const EntityDeviceTableWrapper: React.FC<Props> = ({ entity }) => {
  const queryClient = useQueryClient();
  const [tag, setTag] = useState<Device | undefined>(undefined);
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [refreshId, setRefreshId] = useState(0);
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

  const refreshEntity = () => queryClient.invalidateQueries(['get-entity', entity.id]);

  const refetchTags = () => setRefreshId(refreshId + 1);

  const actions = useCallback(
    (cell) => (
      <Actions
        key={uuid()}
        cell={cell.row}
        refreshEntity={refreshEntity}
        openEditModal={openEditModal}
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
    ),
    [refreshId],
  );

  return (
    <>
      <Box textAlign="right" mb={2}>
        <ImportDeviceCsvModal refresh={refreshEntity} parent={{ entity: entity.id }} deviceClass="entity" />
        <CreateTagModal refresh={refreshEntity} entityId={`entity:${entity.id}`} deviceClass="entity" />
      </Box>
      <InventoryTable
        tagSelect={entity.devices}
        ignoredColumns={['entity', 'venue']}
        refreshId={refreshId}
        actions={actions}
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
    </>
  );
};

export default EntityDeviceTableWrapper;
