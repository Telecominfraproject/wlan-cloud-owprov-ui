import React, { useCallback, useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import Actions from './Actions';
import EditSubscriberDeviceModal from 'components/Modals/SubscriberDevice/EditModal';
import FactoryResetModal from 'components/Modals/SubscriberDevice/FactoryResetModal';
import FirmwareUpgradeModal from 'components/Modals/SubscriberDevice/FirmwareUpgradeModal';
import WifiScanModal from 'components/Modals/SubscriberDevice/WifiScanModal';
import SubscriberDeviceSearch from 'components/SearchBars/SubscriberDeviceSearch';
import SubscriberDeviceTable from 'components/Tables/SubscriberDeviceTable';
import useObjectModal from 'hooks/useObjectModal';
import useRefreshId from 'hooks/useRefreshId';

interface Props {
  operatorId: string;
}

const OperatorDevicesTab = ({ operatorId }: Props) => {
  const { refreshId, refresh } = useRefreshId();
  const { obj: subscriberDevice, openModal, isOpen, onClose } = useObjectModal();
  const [serialNumber, setSerialNumber] = useState<string>('');
  const scanModalProps = useDisclosure();
  const resetModalProps = useDisclosure();
  const upgradeModalProps = useDisclosure();
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
  const actions = useCallback(
    (cell) => (
      <Actions
        key={uuid()}
        cell={cell.row}
        refreshTable={refresh}
        openEdit={openModal}
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
    ),
    [openModal, refreshId],
  );

  return (
    <>
      <Box w="250px">
        <SubscriberDeviceSearch operatorId={operatorId} onClick={openModal} />
      </Box>
      <SubscriberDeviceTable operatorId={operatorId} actions={actions} refreshId={refreshId} minHeight="270px" />
      <EditSubscriberDeviceModal
        isOpen={isOpen}
        onClose={onClose}
        subscriberDevice={subscriberDevice ?? undefined}
        refresh={refresh}
        operatorId={operatorId}
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
      <WifiScanModal modalProps={scanModalProps} serialNumber={serialNumber} />
      <FirmwareUpgradeModal modalProps={upgradeModalProps} serialNumber={serialNumber} />
      <FactoryResetModal modalProps={resetModalProps} serialNumber={serialNumber} />
    </>
  );
};
export default OperatorDevicesTab;
