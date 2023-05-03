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
import { MagnifyingGlass, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useDeleteResource } from 'hooks/Network/Resources';
import { AxiosError } from 'models/Axios';
import { Resource } from 'models/Resource';

type Props = {
  resource: Resource;
  refreshTable: () => void;
  openEditModal: (resource: Resource) => void;
};

const EntityResourceActions = ({ resource, refreshTable, openEditModal }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteResource = useDeleteResource();

  const handleDeleteClick = () =>
    deleteResource.mutateAsync(resource.id, {
      onSuccess: () => {
        onClose();
        refreshTable();
        toast({
          id: `resource-delete-success${uuid()}`,
          title: t('common.success'),
          description: t('crud.success_delete_obj', {
            obj: resource.name,
          }),
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
      onError: (e) => {
        toast({
          id: 'resource-delete-error',
          title: t('common.error'),
          description: t('crud.error_delete_obj', {
            obj: resource.name,
            e: (e as AxiosError)?.response?.data?.ErrorDescription,
          }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    });
  const handleEditClick = () => openEditModal(resource);

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
            {t('crud.delete')} {resource.name}
          </PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('resources.configuration_resource') })}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={deleteResource.isLoading}>
                {t('common.yes')}
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
          onClick={handleEditClick}
        />
      </Tooltip>
    </Flex>
  );
};

export default EntityResourceActions;
