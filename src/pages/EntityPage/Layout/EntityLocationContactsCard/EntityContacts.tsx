import * as React from 'react';
import { Box, Spacer, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import ContactActions from './ContactActions';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import ContactTable from 'components/Tables/ContactTable';
import CreateContactModal from 'components/Tables/ContactTable/CreateContactModal';
import EditContactModal from 'components/Tables/ContactTable/EditContactModal';
import { useGetEntity } from 'hooks/Network/Entity';
import { ContactObj } from 'models/Contact';

type Props = {
  id: string;
};

const EntityContacts = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const getEntity = useGetEntity({ id });
  const [contact, setContact] = React.useState<ContactObj>();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const openEditModal = (newContact: ContactObj) => {
    setContact(newContact);
    openEdit();
  };

  const refetchContacts = () => {
    queryClient.invalidateQueries(['get-contacts-select']);
  };

  const actions = React.useCallback(
    (cell: { row: { original: ContactObj } }) => (
      <ContactActions contact={cell.row.original} refreshEntity={getEntity.refetch} openEditModal={openEditModal} />
    ),
    [],
  );

  return (
    <>
      <CardHeader px={2} pt={2}>
        <Spacer />
        <CreateContactModal refresh={getEntity.refetch} entityId={getEntity.data?.id ?? ''} />
      </CardHeader>
      <CardBody p={4}>
        <Box w="100%" overflowX="auto">
          <ContactTable
            select={getEntity.data?.contacts ?? []}
            actions={actions}
            ignoredColumns={['email', 'entity']}
            openDetailsModal={openEditModal}
          />
        </Box>
      </CardBody>
      <EditContactModal isOpen={isEditOpen} onClose={closeEdit} contact={contact} refresh={refetchContacts} />
    </>
  );
};

export default EntityContacts;
