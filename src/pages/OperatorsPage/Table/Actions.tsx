import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flex,
  IconButton,
  Tooltip,
  useDisclosure,
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
} from '@chakra-ui/react';
import { MagnifyingGlass, Trash } from 'phosphor-react';
import useMutationResult from 'hooks/useMutationResult';
import { useDeleteOperator } from 'hooks/Network/Operators';
import { useNavigate } from 'react-router-dom';

interface Props {
  cell: {
    original: {
      id: string;
      name: string;
      defaultOperator: boolean;
    };
  };
  refreshTable: () => void;
}

const Actions: React.FC<Props> = ({
  cell: {
    original: { id, name, defaultOperator: isDefault },
  },
  refreshTable,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onSuccess, onError } = useMutationResult({
    objName: t('operator.one'),
    operationType: 'delete',
    refresh: refreshTable,
  });
  const deleteOperator = useDeleteOperator({ id });
  const navigate = useNavigate();

  const handleDeleteClick = () =>
    deleteOperator.mutateAsync(undefined, {
      onSuccess: () => onSuccess(),
      onError: (e) => onError(e),
    });
  const handleGoToClick = () => navigate(`/operators/${id}`);

  return (
    <Flex>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton
                aria-label="Open Delete Operator"
                colorScheme="red"
                icon={<Trash size={20} />}
                size="sm"
                isDisabled={isDefault}
              />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {name}
          </PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('operator.one') })}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={deleteOperator.isLoading}>
                {t('common.yes')}
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <Tooltip hasArrow label={t('table.go_to_page')} placement="top">
        <IconButton
          aria-label="Go to Operator Page"
          ml={2}
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          size="sm"
          onClick={handleGoToClick}
        />
      </Tooltip>
    </Flex>
  );
};

export default Actions;
