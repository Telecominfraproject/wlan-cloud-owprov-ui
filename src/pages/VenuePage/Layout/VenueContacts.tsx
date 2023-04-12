import * as React from 'react';
import { Box, Heading, Spacer, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import ContactActions from './ContactActions';
import UseExistingContactModal from './UseContactExistingModal';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import ContactTable from 'components/Tables/ContactTable';
import CreateContactModal from 'components/Tables/ContactTable/CreateContactModal';
import EditContactModal from 'components/Tables/ContactTable/EditContactModal';
import { useAddVenueContact, useGetVenue } from 'hooks/Network/Venues';
import { ContactObj } from 'models/Contact';

type Props = {
  id: string;
};

const VenueContacts = ({ id }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const getVenue = useGetVenue({ id });
  const [contact, setContact] = React.useState<ContactObj>();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { mutateAsync: addContact } = useAddVenueContact({ id, originalContacts: getVenue.data?.contacts });

  const openEditModal = (newContact: ContactObj) => {
    setContact(newContact);
    openEdit();
  };

  const refetchContacts = () => {
    queryClient.invalidateQueries(['get-contacts-select']);
  };

  const onContactCreate = async (newContactId: string) => {
    await addContact(newContactId);
    refetchContacts();
  };

  const actions = React.useCallback(
    (cell: { row: { original: ContactObj } }) => (
      <ContactActions contact={cell.row.original} refreshEntity={getVenue.refetch} openEditModal={openEditModal} />
    ),
    [],
  );

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{t('contacts.other')}</Heading>
        <Spacer />
        <UseExistingContactModal onAssignContact={onContactCreate} venue={getVenue.data} />
        <CreateContactModal refresh={getVenue.refetch} entityId={getVenue.data?.id ?? ''} isVenue />
      </CardHeader>
      <CardBody>
        <Box w="100%" overflowX="auto">
          <ContactTable
            select={getVenue.data?.contacts ?? []}
            actions={actions}
            ignoredColumns={['email', 'entity']}
            openDetailsModal={openEditModal}
          />
        </Box>
      </CardBody>
      <EditContactModal isOpen={isEditOpen} onClose={closeEdit} contact={contact} refresh={refetchContacts} />
    </Card>
  );
};

export default VenueContacts;
