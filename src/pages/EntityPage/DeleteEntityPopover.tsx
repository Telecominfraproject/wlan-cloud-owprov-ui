import React from 'react';
import {
  Button,
  Center,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteButton from 'components/Buttons/DeleteButton';
import { useDeleteEntity } from 'hooks/Network/Entity';
import { AxiosError } from 'models/Axios';
import { Entity } from 'models/Entity';

type Props = {
  entity?: Entity;
  isDisabled: boolean;
};

const DeleteEntityPopover = ({ entity, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteEntity = useDeleteEntity();

  const handleDeleteClick = () =>
    deleteEntity.mutateAsync(entity?.id ?? '', {
      onSuccess: () => {
        queryClient.invalidateQueries(['get-entity-tree']);
        onClose();
        toast({
          id: `entity-delete-success`,
          title: t('common.success'),
          description: t('crud.success_delete_obj', {
            obj: entity?.name,
          }),
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        navigate(`/entity/${entity?.parent}`);
      },
      onError: (e) => {
        if (!toast.isActive('entity-fetching-error'))
          toast({
            id: 'entity-delete-error',
            title: t('common.error'),
            description: t('crud.error_delete_obj', {
              obj: entity?.name,
              e: (e as AxiosError)?.response?.data?.ErrorDescription,
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
      },
    });

  if (entity && (entity.children?.length > 0 || entity.venues?.length > 0)) {
    return (
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <PopoverAnchor>
          <span>
            <DeleteButton onClick={onOpen} isDisabled={isDisabled} isCompact />
          </span>
        </PopoverAnchor>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{t('crud.delete_obj', { obj: t('entities.one') })}</PopoverHeader>
          <PopoverBody>{t('entities.cant_delete_explanation')}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.close')}
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverAnchor>
        <span>
          <DeleteButton onClick={onOpen} isDisabled={isDisabled} isCompact />
        </span>
      </PopoverAnchor>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{t('crud.delete_obj', { obj: t('entities.one') })}</PopoverHeader>
        <PopoverBody>{t('crud.delete_confirm', { obj: t('entities.one') })}</PopoverBody>
        <PopoverFooter>
          <Center>
            <Button colorScheme="gray" mr="1" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={deleteEntity.isLoading}>
              {t('common.yes')}
            </Button>
          </Center>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteEntityPopover;
