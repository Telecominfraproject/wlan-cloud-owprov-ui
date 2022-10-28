import React, { useCallback, useState } from 'react';
import { Flex, Heading, Spacer, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import Actions from './Actions';
import FactoryResetModal from 'components/Modals/SubscriberDevice/FactoryResetModal';
import FirmwareUpgradeModal from 'components/Modals/SubscriberDevice/FirmwareUpgradeModal';
import WifiScanModal from 'components/Modals/SubscriberDevice/WifiScanModal';
import InventoryTable from 'components/Tables/InventoryTable';
import ConfigurationPushModal from 'components/Tables/InventoryTable/ConfigurationPushModal';
import CreateTagModal from 'components/Tables/InventoryTable/CreateTagModal';
import EditTagModal from 'components/Tables/InventoryTable/EditTagModal';
import ImportDeviceCsvModal from 'components/Tables/InventoryTable/ImportDeviceCsvModal';
import { usePushConfig } from 'hooks/Network/Inventory';
import { Device } from 'models/Device';
import { Venue } from 'models/Venue';

interface Props {
  venue?: Venue;
}

const VenueDeviceTableWrapper = ({ venue = undefined }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [tag, setTag] = useState<Device | undefined>(undefined);
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [refreshId, setRefreshId] = useState(0);
  const scanModalProps = useDisclosure();
  const resetModalProps = useDisclosure();
  const upgradeModalProps = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isPushOpen, onOpen: openPush, onClose: closePush } = useDisclosure();
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

  const refreshEntity = () => queryClient.invalidateQueries(['get-venue', venue?.id ?? '']);

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
      <Flex>
        <Heading size="md">{t('devices.title')}</Heading>
        <Spacer />
        <ImportDeviceCsvModal refresh={refreshEntity} parent={{ venue: venue?.id ?? '' }} deviceClass="venue" />
        <CreateTagModal refresh={refreshEntity} entityId={`venue:${venue?.id ?? ''}`} deviceClass="venue" />
      </Flex>
      <InventoryTable
        tagSelect={venue?.devices ?? []}
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

export default VenueDeviceTableWrapper;
