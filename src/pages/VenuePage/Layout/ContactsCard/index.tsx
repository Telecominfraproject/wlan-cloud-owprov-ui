import * as React from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Center,
  HStack,
  Heading,
  IconButton,
  Spacer,
  Spinner,
  Tooltip,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { ListBullets, Table } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import UseExistingContactModal from '../UseContactExistingModal';
import ContactDisplay from './ContactDisplay';
import VenueContacts from './ContactsTable';
import RefreshButton from 'components/Buttons/RefreshButton';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import CreateContactModal from 'components/Tables/ContactTable/CreateContactModal';
import EditContactModal from 'components/Tables/ContactTable/EditContactModal';
import { useGetSelectContacts } from 'hooks/Network/Contacts';
import { TreeEntity, TreeVenue, useGetEntityTree } from 'hooks/Network/Entity';
import { useAddVenueContact, useGetVenue } from 'hooks/Network/Venues';
import { ContactObj } from 'models/Contact';

const traverseTreeToFindId = (tree: TreeEntity, desiredId: string) => {
  const traverse: (node: TreeEntity | TreeVenue) => null | (TreeEntity | TreeVenue)[] = (node) => {
    if (node.uuid === desiredId) {
      return [node];
    }

    for (const child of node.children) {
      const result = traverse(child);
      if (result) {
        return [node, ...result];
      }
    }

    for (const child of node.venues ?? []) {
      const result = traverse(child);
      if (result) {
        return [node, ...result];
      }
    }

    return null;
  };

  return traverse(tree);
};

type Props = {
  id: string;
};

const VenueContactsCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isList, setIsList] = useBoolean(false);
  const getVenue = useGetVenue({ id });
  const getContacts = useGetSelectContacts({
    select: getVenue.data?.contacts ?? [],
  });
  const [contact, setContact] = React.useState<ContactObj>();
  const editProps = useDisclosure();
  const { mutateAsync: addContact } = useAddVenueContact({ id, originalContacts: getVenue.data?.contacts });
  const getEntityTree = useGetEntityTree();

  const pathToEntity = React.useMemo(() => {
    if (getEntityTree.data) {
      const path = traverseTreeToFindId(getEntityTree.data, id);
      if (path) {
        return path.filter(({ uuid }) => uuid !== '0000-0000-0000');
      }
    }

    return [];
  }, [getEntityTree.data, id]);

  const lastEntity = pathToEntity.find(({ type }) => type === 'entity');

  const openEditModal = (newContact: ContactObj) => {
    setContact(newContact);
    editProps.onOpen();
  };

  const refetchContacts = () => {
    queryClient.invalidateQueries(['get-contacts-select']);
  };

  const onContactCreate = async (newContactId: string) => {
    await addContact(newContactId);
    refetchContacts();
  };

  const body = React.useMemo(() => {
    if (!getContacts.data || !getVenue.data) {
      return (
        <Center my={8}>
          <Spinner size="xl" />
        </Center>
      );
    }

    if (getContacts.data.length === 0 && isList) {
      return (
        <Alert my={4}>
          <AlertTitle>
            {t('common.no')} {t('contacts.other')}
          </AlertTitle>
          <AlertDescription>
            Add new contacts to this venue by clicking the &quot;Create&quot; or &quot;Use Existing&quot; button
          </AlertDescription>
        </Alert>
      );
    }

    if (isList)
      return getContacts.data.map((value, i) => (
        <>
          <ContactDisplay key={value.id} contact={value} openEditModal={openEditModal} venue={getVenue.data} />
          {i !== getContacts.data.length - 1 && <Box h="1px" bg="gray.200" w="100%" my={4} />}
        </>
      ));

    return <VenueContacts id={id} />;
  }, [getContacts, id, isList]);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{t('contacts.other')}</Heading>
        <Spacer />
        <HStack>
          <Tooltip label="Table View">
            <IconButton
              aria-label="View as Table"
              colorScheme="teal"
              variant="ghost"
              isActive={!isList}
              icon={<Table size={20} />}
              onClick={setIsList.off}
            />
          </Tooltip>
          <Tooltip label="List View">
            <IconButton
              aria-label="View as List"
              colorScheme="teal"
              variant="ghost"
              isActive={isList}
              icon={<ListBullets size={20} />}
              onClick={setIsList.on}
            />
          </Tooltip>
          <UseExistingContactModal onAssignContact={onContactCreate} venue={getVenue.data} />
          <CreateContactModal refresh={getVenue.refetch} entityId={lastEntity?.uuid ?? ''} onCreate={onContactCreate} />
          <RefreshButton isFetching={getContacts.isFetching} onClick={getContacts.refetch} />
        </HStack>
      </CardHeader>
      <CardBody>
        <Box w="100%">{body}</Box>
      </CardBody>
      <EditContactModal {...editProps} contact={contact} refresh={refetchContacts} />
    </Card>
  );
};

export default VenueContactsCard;
