import * as React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import ContactActions from './Actions';
import ContactTable from 'components/Tables/ContactTable';
import EditContactModal from 'components/Tables/ContactTable/EditContactModal';
import { useGetVenue } from 'hooks/Network/Venues';
import { ContactObj } from 'models/Contact';

type Props = {
  id: string;
};

const VenueContacts = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const getVenue = useGetVenue({ id });
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
      <ContactActions contact={cell.row.original} openEditModal={openEditModal} venue={getVenue.data} />
    ),
    [getVenue.data],
  );

  return (
    <>
      <ContactTable
        select={getVenue.data?.contacts ?? []}
        actions={actions}
        ignoredColumns={['email', 'entity']}
        openDetailsModal={openEditModal}
      />
      <EditContactModal isOpen={isEditOpen} onClose={closeEdit} contact={contact} refresh={refetchContacts} />
    </>
  );
};

export default VenueContacts;
