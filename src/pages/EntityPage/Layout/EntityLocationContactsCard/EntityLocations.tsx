import * as React from 'react';
import { Box, Spacer, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import LocationActions from './LocationActions';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import LocationTable from 'components/Tables/LocationTable';
import CreateLocationModal from 'components/Tables/LocationTable/CreateLocationModal';
import EditLocationModal from 'components/Tables/LocationTable/EditLocationModal';
import { useGetEntity } from 'hooks/Network/Entity';
import { Location } from 'models/Location';

type Props = {
  id: string;
};

const EntityLocations = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const getEntity = useGetEntity({ id });
  const [location, setLocation] = React.useState<Location>();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const openEditModal = (newLoc: Location) => {
    setLocation(newLoc);
    openEdit();
  };

  const refetchLocations = () => {
    queryClient.invalidateQueries(['get-locations-select']);
  };

  const actions = React.useCallback(
    (cell: { row: { original: Location } }) => (
      <LocationActions location={cell.row.original} refreshEntity={getEntity.refetch} openEditModal={openEditModal} />
    ),
    [],
  );

  return (
    <>
      <CardHeader px={2} pt={2}>
        <Spacer />
        <CreateLocationModal refresh={getEntity.refetch} entityId={getEntity.data?.id ?? ''} />
      </CardHeader>
      <CardBody p={4}>
        <Box w="100%" overflowX="auto">
          <LocationTable
            select={getEntity.data?.locations ?? []}
            actions={actions}
            ignoredColumns={['entity']}
            openDetailsModal={openEditModal}
          />
        </Box>
      </CardBody>
      <EditLocationModal isOpen={isEditOpen} onClose={closeEdit} location={location} refresh={refetchLocations} />
    </>
  );
};

export default EntityLocations;
