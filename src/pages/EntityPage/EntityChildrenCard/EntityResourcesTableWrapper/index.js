import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { EntityShape } from 'constants/propShapes';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import ResourceTable from 'components/Tables/ResourceTable';
import CreateResourceModal from 'components/Modals/Resources/CreateModal';
import EditResourceModal from 'components/Modals/Resources/EditModal';
import Actions from './Actions';

const propTypes = {
  entity: PropTypes.shape(EntityShape).isRequired,
};

const EntityResourcesTableWrapper = ({ entity }) => {
  const queryClient = useQueryClient();
  const [resource, setResource] = useState(null);
  const [refreshId, setRefreshId] = useState(0);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const openEditModal = (newResource) => {
    setResource(newResource);
    openEdit();
  };

  const refreshEntity = () => queryClient.invalidateQueries(['get-entity', entity.id]);

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
        <CreateResourceModal refresh={refreshEntity} entityId={entity.id} />
      </Box>
      <ResourceTable select={entity.variables} actions={actions} refreshId={refreshId} ignoredColumns={['entity']} />
      <EditResourceModal isOpen={isEditOpen} onClose={closeEdit} resource={resource} refresh={refreshTable} />
    </>
  );
};

EntityResourcesTableWrapper.propTypes = propTypes;
export default EntityResourcesTableWrapper;
