import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Center,
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  Portal,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import { useDeleteConfiguration } from 'hooks/Network/Configurations';
import { AxiosError } from 'axios';
import { Trash } from 'phosphor-react';
import { Configuration } from 'models/Configuration';

type Props = {
  configuration: Configuration;
  isDisabled?: boolean;
};

const DeleteConfigurationButton = ({ configuration, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const deleteConfig = useDeleteConfiguration();

  const handleDeleteClick = () =>
    deleteConfig.mutateAsync(configuration.id, {
      onSuccess: () => {
        if (configuration.entity !== '') {
          queryClient.invalidateQueries(['get-entity', configuration.entity]);
        } else if (configuration.venue !== '') {
          queryClient.invalidateQueries(['get-venue', configuration.venue]);
        }
        onClose();
        toast({
          id: `config-delete-success`,
          title: t('common.success'),
          description: t('crud.success_delete_obj', {
            obj: configuration.name,
          }),
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
      onError: (e) => {
        const err = e as AxiosError;
        if (!toast.isActive('config-delete-error'))
          toast({
            id: 'config-delete-error',
            title: t('common.error'),
            description: t('crud.error_delete_obj', {
              obj: configuration.name,
              e: err?.response?.data?.ErrorDescription,
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
      },
    });

  if (configuration?.inUse?.length > 0) {
    return (
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <PopoverAnchor>
          <span>
            <Tooltip label={t('crud.delete')}>
              <IconButton
                colorScheme="red"
                aria-label="delete"
                type="button"
                size="sm"
                onClick={onOpen}
                icon={<Trash size={20} />}
                isDisabled={isDisabled}
              />
            </Tooltip>
          </span>
        </PopoverAnchor>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{t('crud.delete_obj', { obj: t('configurations.one') })}</PopoverHeader>
            <PopoverBody>{t('configurations.cant_delete_explanation_simple')}</PopoverBody>
            <PopoverFooter>
              <Center>
                <Button colorScheme="gray" mr="1" onClick={onClose}>
                  {t('common.close')}
                </Button>
              </Center>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    );
  }

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverAnchor>
        <span>
          <Tooltip label={t('crud.delete')}>
            <IconButton
              colorScheme="red"
              aria-label="delete"
              type="button"
              size="sm"
              onClick={onOpen}
              icon={<Trash size={20} />}
              isDisabled={isDisabled}
            />
          </Tooltip>
        </span>
      </PopoverAnchor>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{t('crud.delete_obj', { obj: t('configurations.one') })}</PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('configurations.one') })}</PopoverBody>
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
      </Portal>
    </Popover>
  );
};

export default DeleteConfigurationButton;
