import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Box } from '@chakra-ui/react';
import useRefreshId from 'hooks/useRefreshId';
import useObjectModal from 'hooks/useObjectModal';
import OperatorLocationTable from 'components/Tables/OperatorLocationTable';
import EditOperatorLocationModal from 'components/Tables/OperatorLocationTable/EditModal';
import CreateOperatorLocationModal from 'components/Tables/OperatorLocationTable/CreateModal';
import Actions from './Actions';

const propTypes = {
  operatorId: PropTypes.string.isRequired,
};

const LocationTab = ({ operatorId }) => {
  const { refreshId, refresh } = useRefreshId();
  const { obj: location, openModal, isOpen, onClose } = useObjectModal();
  const actions = useCallback(
    (cell) => <Actions key={uuid()} cell={cell.row} refreshTable={refresh} openEdit={openModal} />,
    [openModal, refreshId],
  );

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateOperatorLocationModal refresh={refresh} operatorId={operatorId} />
      </Box>
      <OperatorLocationTable operatorId={operatorId} actions={actions} refreshId={refreshId} />
      <EditOperatorLocationModal isOpen={isOpen} onClose={onClose} location={location} refresh={refresh} />
    </>
  );
};
LocationTab.propTypes = propTypes;
export default LocationTab;
