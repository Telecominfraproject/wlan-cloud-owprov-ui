import React from 'react';
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
import { MagnifyingGlass, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useRemoveVenueContact } from 'hooks/Network/Venues';
import { ContactObj } from 'models/Contact';
import { VenueApiResponse } from 'models/Venue';

type Props = {
  contact: ContactObj;
  venue?: VenueApiResponse;
  openEditModal: (contact: ContactObj) => void;
};

const ContactActions = ({ contact, openEditModal, venue }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteConfig = useRemoveVenueContact({
    id: venue?.id ?? '',
    originalContacts: venue?.contacts,
  });

  const handleDeleteClick = () =>
    deleteConfig.mutateAsync(contact.id, {
      onSuccess: () => {
        onClose();
      },
    });
  const handleOpenEdit = () => openEditModal(contact);

  return (
    <Flex>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton aria-label={t('crud.delete')} colorScheme="red" icon={<Trash size={20} />} size="sm" />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {contact.name}
          </PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('contacts.one') })}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={deleteConfig.isLoading}>
                Yes
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          aria-label={t('common.view_details')}
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

export default ContactActions;
