import * as React from 'react';
import { Box, Flex, Spacer, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import EntityResourceActions from './ResourceActions';
import CardBody from 'components/Card/CardBody';
import CreateResourceModal from 'components/Modals/Resources/CreateModal';
import EditResourceModal from 'components/Modals/Resources/EditModal';
import ResourcesTable from 'components/Tables/ResourceTable';
import { useGetVenue } from 'hooks/Network/Venues';
import { Resource } from 'models/Resource';

type Props = {
  id: string;
};

const VenueResources = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const [resource, setResource] = React.useState<Resource>();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const getVenue = useGetVenue({ id });

  const refreshTable = () => {
    queryClient.invalidateQueries(['get-resources-with-select']);
  };

  const openEditModal = (openedResource: Resource) => () => {
    setResource(openedResource);
    openEdit();
  };
  const openDetailsModalFromTable = (openedResource: Resource) => {
    setResource(openedResource);
    openEdit();
  };

  const actions = React.useCallback(
    (cell: { row: { original: Resource } }) => (
      <EntityResourceActions
        resource={cell.row.original}
        refreshTable={getVenue.refetch}
        openEditModal={openEditModal(cell.row.original)}
      />
    ),
    [],
  );

  return (
    <>
      <Flex px={2} pt={2}>
        <Spacer />
        <CreateResourceModal refresh={getVenue.refetch} entityId={id} isVenue />
      </Flex>
      <CardBody p={4}>
        <Box w="100%" overflowX="auto">
          <ResourcesTable
            select={getVenue.data?.variables ?? []}
            actions={actions}
            openDetailsModal={openDetailsModalFromTable}
          />
        </Box>
      </CardBody>
      <EditResourceModal isOpen={isEditOpen} onClose={closeEdit} resource={resource} refresh={refreshTable} />
    </>
  );
};

export default VenueResources;
