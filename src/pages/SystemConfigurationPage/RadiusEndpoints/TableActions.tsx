import * as React from 'react';
import {
  Box,
  Button,
  Center,
  HStack,
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
} from '@chakra-ui/react';
import { MagnifyingGlass, Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { RadiusEndpoint, useDeleteRadiusEndpoint } from 'hooks/Network/RadiusEndpoints';
import { useNotification } from 'hooks/useNotification';

type Props = {
  endpoint: RadiusEndpoint;
  onEdit: (endpoint: RadiusEndpoint) => void;
};

const RadiusEndpointActions = ({ endpoint, onEdit }: Props) => {
  const { t } = useTranslation();
  const deleteEndpoint = useDeleteRadiusEndpoint();
  const { successToast, apiErrorToast } = useNotification();

  const onDelete = (onClose: () => void) => async () => {
    await deleteEndpoint.mutateAsync(endpoint.id, {
      onSuccess: () => {
        successToast({
          description: 'Endpoint deleted',
        });
        onClose();
      },
      onError: (error) => {
        apiErrorToast({ e: error });
      },
    });
  };

  return (
    <HStack spacing={2}>
      <Popover placement="start">
        {({ onClose, isOpen }) => (
          <>
            <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
              <Box>
                <PopoverTrigger>
                  <IconButton aria-label={t('crud.delete')} colorScheme="red" icon={<Trash size={20} />} size="sm" />
                </PopoverTrigger>
              </Box>
            </Tooltip>
            <PopoverContent w="350px">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>
                {t('crud.delete')} {endpoint.name}
              </PopoverHeader>
              <PopoverBody>{t('crud.delete_confirm', { obj: 'radius endpoint' })}</PopoverBody>
              <PopoverFooter>
                <Center>
                  <Button colorScheme="gray" mr="1" onClick={onClose}>
                    {t('common.cancel')}
                  </Button>
                  <Button colorScheme="red" ml="1" onClick={onDelete(onClose)} isLoading={deleteEndpoint.isLoading}>
                    {t('common.yes')}
                  </Button>
                </Center>
              </PopoverFooter>
            </PopoverContent>
          </>
        )}
      </Popover>
      <Tooltip label={t('common.view_details')}>
        <IconButton
          aria-label={t('common.view_details')}
          onClick={() => onEdit(endpoint)}
          size="sm"
          icon={<MagnifyingGlass size={20} />}
          colorScheme="blue"
        />
      </Tooltip>
    </HStack>
  );
};

export default RadiusEndpointActions;
