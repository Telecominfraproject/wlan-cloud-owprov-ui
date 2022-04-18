import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Flex, Heading, Spacer } from '@chakra-ui/react';
import useRefreshId from 'hooks/useRefreshId';
import useObjectModal from 'hooks/useObjectModal';
import SubscriberDeviceTable from 'components/Tables/SubscriberDeviceTable';
import CreateSubscriberDeviceModal from 'components/Tables/SubscriberDeviceTable/CreateModal';
import EditSubscriberDeviceModal from 'components/Tables/SubscriberDeviceTable/EditModal';
import Actions from './Actions';

const propTypes = {
  operatorId: PropTypes.string.isRequired,
  subscriberId: PropTypes.string.isRequired,
};

const OperatorDevicesTab = ({ operatorId, subscriberId }) => {
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
OperatorDevicesTab.propTypes = propTypes;
export default OperatorDevicesTab;
