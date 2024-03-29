import React, { useCallback, useState } from 'react';
import { Flex, Heading, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import Actions from './Actions';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import CreateSubscriberDeviceModal from 'components/Modals/SubscriberDevice/CreateModal';
import EditSubscriberDeviceModal from 'components/Modals/SubscriberDevice/EditModal';
import FactoryResetModal from 'components/Modals/SubscriberDevice/FactoryResetModal';
import FirmwareUpgradeModal from 'components/Modals/SubscriberDevice/FirmwareUpgradeModal';
import WifiScanModal from 'components/Modals/SubscriberDevice/WifiScanModal';
import SubscriberDeviceTable from 'components/Tables/SubscriberDeviceTable';
import useObjectModal from 'hooks/useObjectModal';
import useRefreshId from 'hooks/useRefreshId';
import { Device } from 'models/Device';

interface Props {
  operatorId: string;
  subscriberId: string;
}

const OperatorDevicesTab: React.FC<Props> = ({ operatorId, subscriberId }) => {
  const { t } = useTranslation();
  const { refreshId, refresh } = useRefreshId();
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [devices, setDevices] = useState<Device[]>([]);
  const scanModalProps = useDisclosure();
  const resetModalProps = useDisclosure();
  const upgradeModalProps = useDisclosure();
  const { obj: subscriberDevice, openModal, isOpen, onClose } = useObjectModal();
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
      <CardHeader>
        <Heading size="md">{t('devices.title')}</Heading>
        <Spacer />
        <CreateSubscriberDeviceModal
          refresh={refresh}
          operatorId={operatorId}
          subscriberId={subscriberId}
          devices={devices}
        />
      </CardHeader>
      <CardBody display="block">
        <SubscriberDeviceTable
          operatorId={operatorId}
          subscriberId={subscriberId}
          actions={actions}
          onOpenDetails={openModal}
          refreshId={refreshId}
          minHeight="380px"
          setDevices={setDevices}
        />
      </CardBody>
      <EditSubscriberDeviceModal
        isOpen={isOpen}
        onClose={onClose}
        subscriberDevice={subscriberDevice || undefined}
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
