import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Flex,
  IconButton,
  Tooltip,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Center,
  Box,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { MagnifyingGlass, Trash } from 'phosphor-react';
import useMutationResult from 'hooks/useMutationResult';
import { useDeleteOperatorLocation } from 'hooks/Network/OperatorLocations';

const propTypes = {
  cell: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  refreshTable: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
};

const Actions = ({
  cell: {
    original: { id, name },
  },
  cell: { original: location },
  refreshTable,
  openEdit,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onSuccess, onError } = useMutationResult({
    objName: t('locations.one'),
    operationType: 'delete',
    refresh: refreshTable,
  });
  const deleteLocation = useDeleteOperatorLocation({ id });

  const handleEditClick = () => {
    openEdit(location);
  };

  const handleDeleteClick = () =>
    deleteLocation.mutateAsync(
      {},
      {
        onSuccess: () => onSuccess(),
        onError: (e) => onError(e),
      },
    );

  return (
    <Flex>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton colorScheme="red" icon={<Trash size={20} />} size="sm" />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {name}
          </PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('locations.one') })}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={deleteLocation.isLoading}>
                {t('common.yes')}
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
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

Actions.propTypes = propTypes;

export default Actions;
