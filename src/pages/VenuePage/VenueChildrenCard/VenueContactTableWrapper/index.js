import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { EntityShape } from 'constants/propShapes';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import CreateContactModal from 'components/Tables/ContactTable/CreateContactModal';
import EditContactModal from 'components/Tables/ContactTable/EditContactModal';
import ContactTable from 'components/Tables/ContactTable';
import Actions from './Actions';

const propTypes = {
  venue: PropTypes.shape(EntityShape),
};
const defaultProps = {
  venue: null,
};

const VenueContactTableWrapper = ({ venue }) => {
  const queryClient = useQueryClient();
  const [contact, setContact] = useState(null);
  const [refreshId, setRefreshId] = useState(0);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const openEditModal = (newContact) => {
    setContact(newContact);
    openEdit();
  };

  const refreshEntity = () => queryClient.invalidateQueries(['get-venue', venue.id]);

  const refetchLocations = () => {
    setRefreshId(refreshId + 1);
    refreshEntity();
  };

  const actions = useCallback(
    (cell) => <Actions key={uuid()} cell={cell.row} refreshEntity={refreshEntity} openEditModal={openEditModal} />,
    [refreshId],
  );

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateContactModal refresh={refreshEntity} entityId={venue.id} isVenue />
      </Box>
      <ContactTable
        select={venue.contacts}
        actions={actions}
        refreshId={refreshId}
        ignoredColumns={['entity', 'venue']}
      />
      <EditContactModal isOpen={isEditOpen} onClose={closeEdit} contact={contact} refresh={refetchLocations} />
    </>
  );
};

VenueContactTableWrapper.propTypes = propTypes;
VenueContactTableWrapper.defaultProps = defaultProps;
export default VenueContactTableWrapper;
