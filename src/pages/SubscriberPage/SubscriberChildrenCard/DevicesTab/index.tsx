import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Flex, Heading, Spacer } from '@chakra-ui/react';
import useRefreshId from 'hooks/useRefreshId';
import useObjectModal from 'hooks/useObjectModal';
import SubscriberDeviceTable from 'components/Tables/SubscriberDeviceTable';
import CreateSubscriberDeviceModal from 'components/Modals/SubscriberDevice/CreateModal';
import EditSubscriberDeviceModal from 'components/Modals/SubscriberDevice/EditModal';
import Actions from './Actions';

interface Props {
  operatorId: string;
  subscriberId: string;
}

const OperatorDevicesTab: React.FC<Props> = ({ operatorId, subscriberId }) => {
  const { t } = useTranslation();
  const { refreshId, refresh } = useRefreshId();
  const { obj: subscriberDevice, openModal, isOpen, onClose } = useObjectModal();
  const actions = useCallback(
    (cell) => <Actions key={uuid()} cell={cell.row} refreshTable={refresh} openEdit={openModal} />,
    [openModal, refreshId],
  );

  return (
    <>
      <Flex mb={2}>
        <Heading size="md">{t('devices.title')}</Heading>
        <Spacer />
        <CreateSubscriberDeviceModal refresh={refresh} operatorId={operatorId} subscriberId={subscriberId} />
      </Flex>
      <SubscriberDeviceTable
        operatorId={operatorId}
        subscriberId={subscriberId}
        actions={actions}
        refreshId={refreshId}
        minHeight="380px"
      />
      <EditSubscriberDeviceModal
        isOpen={isOpen}
        onClose={onClose}
        subscriberDevice={subscriberDevice}
        refresh={refresh}
        operatorId={operatorId}
      />
    </>
  );
};
export default OperatorDevicesTab;
