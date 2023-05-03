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
  useToast,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { MagnifyingGlass, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { AxiosError } from 'models/Axios';
import { ContactObj } from 'models/Contact';
import { axiosProv } from 'utils/axiosInstances';

const deleteApi = async (id: string) => axiosProv.delete(`/contact/${id}`).then(() => true);

type Props = {
  contact: ContactObj;
  refreshEntity: () => void;
  openEditModal: (contact: ContactObj) => void;
};

const ContactActions = ({ contact, refreshEntity, openEditModal }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteConfig = useMutation(() => deleteApi(contact.id), {
    onSuccess: () => {
      onClose();
      refreshEntity();
      toast({
        id: `contact-delete-success${uuid()}`,
        title: t('common.success'),
        description: t('crud.success_delete_obj', {
          obj: contact.name,
        }),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (e) => {
      toast({
        id: 'contact-delete-error',
        title: t('common.error'),
        description: t('crud.error_delete_obj', {
          obj: contact.name,
          e: (e as AxiosError)?.response?.data?.ErrorDescription,
        }),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const handleDeleteClick = () => deleteConfig.mutateAsync();
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
