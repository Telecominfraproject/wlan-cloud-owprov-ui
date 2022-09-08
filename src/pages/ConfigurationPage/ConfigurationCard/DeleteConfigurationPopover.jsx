import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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
import DeleteButton from 'components/Buttons/DeleteButton';
import { EntityShape } from 'constants/propShapes';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useDeleteConfiguration } from 'hooks/Network/Configurations';

const propTypes = {
  configuration: PropTypes.shape(EntityShape),
  isDisabled: PropTypes.bool,
};

const defaultProps = {
  configuration: { name: '', id: '' },
  isDisabled: false,
};

const DeleteConfigurationPopover = ({ configuration, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteConfig = useDeleteConfiguration();

  const handleDeleteClick = () =>
    deleteConfig.mutateAsync(configuration.id, {
      onSuccess: () => {
        queryClient.invalidateQueries(['get-configurations']);
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
        if (configuration.entity !== '') navigate(`/entity/${configuration.entity}`);
        else navigate(`/venue/${configuration.venue}`);
      },
      onError: (e) => {
        if (!toast.isActive('config-delete-error'))
          toast({
            id: 'config-delete-error',
            title: t('common.error'),
            description: t('crud.error_delete_obj', {
              obj: configuration.name,
              e: e?.response?.data?.ErrorDescription,
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
            <DeleteButton onClick={onOpen} isDisabled={isDisabled} ml={2} />
          </span>
        </PopoverAnchor>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{t('crud.delete_obj', { obj: t('configurations.one') })}</PopoverHeader>
          <PopoverBody>{t('configurations.cant_delete_explanation')}</PopoverBody>
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
          <DeleteButton onClick={onOpen} isDisabled={isDisabled} ml={2} />
        </span>
      </PopoverAnchor>
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
    </Popover>
  );
};

DeleteConfigurationPopover.propTypes = propTypes;
DeleteConfigurationPopover.defaultProps = defaultProps;
export default DeleteConfigurationPopover;
