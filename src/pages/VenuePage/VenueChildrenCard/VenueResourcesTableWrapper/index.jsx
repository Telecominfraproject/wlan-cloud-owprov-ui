import React, { useCallback, useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import Actions from './Actions';
import CreateResourceModal from 'components/Modals/Resources/CreateModal';
import EditResourceModal from 'components/Modals/Resources/EditModal';
import ResourceTable from 'components/Tables/ResourceTable';
import { EntityShape } from 'constants/propShapes';

const propTypes = {
  venue: PropTypes.shape(EntityShape).isRequired,
};

const VenueResourcesTableWrapper = ({ venue }) => {
  const queryClient = useQueryClient();
  const [resource, setResource] = useState(null);
  const [refreshId, setRefreshId] = useState(0);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const openEditModal = (newResource) => {
    setResource(newResource);
    openEdit();
  };

  const refreshEntity = () => queryClient.invalidateQueries(['get-venue', venue.id]);

  const refreshTable = () => {
    setRefreshId(refreshId + 1);
  };

  const actions = useCallback(
    (cell) => <Actions key={uuid()} cell={cell.row} refreshTable={refreshEntity} openEditModal={openEditModal} />,
    [refreshId],
  );

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateResourceModal refresh={refreshEntity} entityId={venue.id} isVenue />
      </Box>
      <ResourceTable select={venue.variables} actions={actions} refreshId={refreshId} ignoredColumns={['entity']} />
      <EditResourceModal isOpen={isEditOpen} onClose={closeEdit} resource={resource} refresh={refreshTable} />
    </>
  );
};

VenueResourcesTableWrapper.propTypes = propTypes;
export default VenueResourcesTableWrapper;
