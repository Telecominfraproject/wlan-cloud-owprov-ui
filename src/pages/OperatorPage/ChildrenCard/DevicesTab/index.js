import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import useRefreshId from 'hooks/useRefreshId';
import useObjectModal from 'hooks/useObjectModal';
import { Box } from '@chakra-ui/react';
import SubscriberDeviceTable from 'components/Tables/SubscriberDeviceTable';
import EditSubscriberDeviceModal from 'components/Modals/SubscriberDevice/EditModal';
import SubscriberDeviceSearch from 'components/SearchBars/SubscriberDeviceSearch';
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
      <Box w="250px">
        <SubscriberDeviceSearch operatorId={operatorId} onClick={openModal} />
      </Box>
      <SubscriberDeviceTable operatorId={operatorId} actions={actions} refreshId={refreshId} minHeight="270px" />
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
