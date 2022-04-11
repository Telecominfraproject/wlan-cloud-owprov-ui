import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Box } from '@chakra-ui/react';
import useRefreshId from 'hooks/useRefreshId';
import useObjectModal from 'hooks/useObjectModal';
import OperatorContactTable from 'components/Tables/OperatorContactTable';
import EditOperatorContactModal from 'components/Tables/OperatorContactTable/EditModal';
import CreateOperatorContactModal from 'components/Tables/OperatorContactTable/CreateModal';
import Actions from './Actions';

const propTypes = {
  operatorId: PropTypes.string.isRequired,
};

const ContactTab = ({ operatorId }) => {
  const { refreshId, refresh } = useRefreshId();
  const { obj: contact, openModal, isOpen, onClose } = useObjectModal();
  const actions = useCallback(
    (cell) => <Actions key={uuid()} cell={cell.row} refreshTable={refresh} openEdit={openModal} />,
    [openModal, refreshId],
  );

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateOperatorContactModal refresh={refresh} operatorId={operatorId} />
      </Box>
      <OperatorContactTable operatorId={operatorId} actions={actions} refreshId={refreshId} />
      <EditOperatorContactModal isOpen={isOpen} onClose={onClose} contact={contact} refresh={refresh} />
    </>
  );
};
ContactTab.propTypes = propTypes;
export default ContactTab;
