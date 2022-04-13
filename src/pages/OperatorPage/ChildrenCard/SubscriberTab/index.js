import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Box } from '@chakra-ui/react';
import useRefreshId from 'hooks/useRefreshId';
import SubscriberTable from 'components/Tables/SubscriberTable';
import CreateSubscriberModal from 'components/Tables/SubscriberTable/CreateModal';
import Actions from './Actions';

const propTypes = {
  operatorId: PropTypes.string.isRequired,
};

const SubscriberTab = ({ operatorId }) => {
  const { refreshId, refresh } = useRefreshId();
  const actions = useCallback((cell) => <Actions key={uuid()} cell={cell.row} refreshTable={refresh} />, [refreshId]);

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateSubscriberModal refresh={refresh} operatorId={operatorId} />
      </Box>
      <SubscriberTable operatorId={operatorId} actions={actions} refreshId={refreshId} />
    </>
  );
};
SubscriberTab.propTypes = propTypes;
export default SubscriberTab;
