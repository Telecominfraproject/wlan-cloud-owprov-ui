import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { MagnifyingGlass, Trash } from 'phosphor-react';
import { Contact } from 'models/Contact';
import { useRemoveVenueContact } from 'hooks/Network/Venues';

interface Props {
  cell: {
    original: Contact;
  };
  refreshEntity: () => void;
  openEditModal: (contact: Contact) => void;
  originalContacts: string[];
  venueId: string;
}

const Actions: React.FC<Props> = ({
  cell: { original: contact },
  refreshEntity,
  openEditModal,
  originalContacts,
  venueId,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync: removeContactClaim, isLoading: isRemoving } = useRemoveVenueContact({
    id: venueId,
    originalContacts,
    refresh: refreshEntity,
  });

  const handleDeleteClick = () => {
    removeContactClaim(contact.id);
  };
  const handleOpenEdit = () => openEditModal(contact);

  return (
    <Flex>
      <Popover placement="left" isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton aria-label="Open Remove Contact" colorScheme="red" icon={<Trash size={20} />} size="sm" />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent width="380px">
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('common.remove')} {contact.name}
          </PopoverHeader>
          <PopoverBody px={3} overflowWrap="break-word">
            {t('venues.confirm_remove_contact')}
          </PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={isRemoving}>
                Yes
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          aria-label="View Contact Details"
          ml={2}
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          size="sm"
          onClick={handleOpenEdit}
        />
      </Tooltip>
    </Flex>
  );
};

export default Actions;
