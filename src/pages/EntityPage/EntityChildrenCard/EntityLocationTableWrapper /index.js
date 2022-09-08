import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { EntityShape } from 'constants/propShapes';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import EditLocationModal from 'components/Tables/LocationTable/EditLocationModal';
import CreateLocationModal from 'components/Tables/LocationTable/CreateLocationModal';
import LocationTable from 'components/Tables/LocationTable';
import Actions from './Actions';

const propTypes = {
  entity: PropTypes.shape(EntityShape).isRequired,
};

const EntityLocationTableWrapper = ({ entity }) => {
  const queryClient = useQueryClient();
  const [location, setLocation] = useState(null);
  const [refreshId, setRefreshId] = useState(0);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const openEditModal = (newLoc) => {
    setLocation(newLoc);
    openEdit();
  };

  const refreshEntity = () => queryClient.invalidateQueries(['get-entity', entity.id]);

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
        <CreateLocationModal refresh={refreshEntity} entityId={entity.id} />
      </Box>
      <LocationTable select={entity.locations} actions={actions} refreshId={refreshId} ignoredColumns={['entity']} />
      <EditLocationModal isOpen={isEditOpen} onClose={closeEdit} location={location} refresh={refetchLocations} />
    </>
  );
};

EntityLocationTableWrapper.propTypes = propTypes;
export default EntityLocationTableWrapper;
