import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Box } from '@chakra-ui/react';
import useRefreshId from 'hooks/useRefreshId';
import useObjectModal from 'hooks/useObjectModal';
import SubscriberDeviceTable from 'components/Tables/SubscriberDeviceTable';
import CreateSubscriberDeviceModal from 'components/Tables/SubscriberDeviceTable/CreateModal';
import EditSubscriberDeviceModal from 'components/Tables/SubscriberDeviceTable/EditModal';
import Actions from './Actions';

const propTypes = {
  operatorId: PropTypes.string.isRequired,
};

const OperatorDevicesTab = ({ operatorId }) => {
  const { refreshId, refresh } = useRefreshId();
  const { obj: subscriberDevice, openModal, isOpen, onClose } = useObjectModal();
  const actions = useCallback(
    (cell) => <Actions key={uuid()} cell={cell.row} refreshTable={refresh} openEdit={openModal} />,
    [openModal, refreshId],
  );

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateSubscriberDeviceModal refresh={refresh} operatorId={operatorId} />
      </Box>
      <SubscriberDeviceTable operatorId={operatorId} actions={actions} refreshId={refreshId} />
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
