import * as React from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  Text,
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
  openEditModal: (newContact: ContactObj) => void;
  venue: VenueApiResponse;
};

const ContactDisplay = ({ contact, openEditModal, venue }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteConfig = useRemoveVenueContact({
    id: venue?.id,
    originalContacts: venue?.contacts,
  });

  const handleDeleteClick = () =>
    deleteConfig.mutateAsync(contact.id, {
      onSuccess: () => {
        onClose();
      },
    });
  let contacting = [contact.primaryEmail];
  if (contact.secondaryEmail.length > 0) contacting.push(contact.secondaryEmail);
  contacting = [...contacting, ...contact.phones, ...contact.mobiles];

  const onView = () => openEditModal(contact);

  return (
    <Box>
      <Flex mb={1}>
        <HStack>
          <Heading size="md" my="auto">
            {contact.salutation.length > 0 ? `${contact.salutation} ` : ''}
            {contact.name}
          </Heading>
          <Tag colorScheme="blue" my="auto">
            {contact.type}
          </Tag>
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
                    {t('common.yes')}
                  </Button>
                </Center>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
          <Tooltip hasArrow label={t('common.view_details')} placement="top" ml={2}>
            <IconButton
              aria-label={t('common.view_details')}
              colorScheme="blue"
              icon={<MagnifyingGlass size={20} />}
              size="sm"
              onClick={onView}
            />
          </Tooltip>
        </HStack>
      </Flex>
      <Text fontStyle="italic">{contact.title}</Text>
      <Flex>
        <Text>{contacting.join(', ')}</Text>
      </Flex>
    </Box>
  );
};

export default ContactDisplay;
