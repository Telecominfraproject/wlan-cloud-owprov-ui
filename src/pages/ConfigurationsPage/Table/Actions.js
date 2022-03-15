import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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
import { ListChecks, ListDashes, MagnifyingGlass, Trash } from 'phosphor-react';
import { useMutation } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';
import { v4 as createUuid } from 'uuid';
import { useNavigate } from 'react-router-dom';

const deleteApi = async (configId) =>
  axiosProv.delete(`/configurations/${configId}`).then(() => true);

const propTypes = {
  cell: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      inUse: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
  refreshTable: PropTypes.func.isRequired,
  openInUseModal: PropTypes.func.isRequired,
  openAffectedModal: PropTypes.func.isRequired,
};

const Actions = ({
  cell: { original: configuration },
  refreshTable,
  openInUseModal,
  openAffectedModal,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteConfig = useMutation(() => deleteApi(configuration.id), {
    onSuccess: () => {
      onClose();
      refreshTable();
      toast({
        id: `configuration-delete-success${createUuid()}`,
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
      toast({
        id: 'user-delete-error',
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

  const handleDeleteClick = () => deleteConfig.mutateAsync();
  const handleOpenInUse = () => openInUseModal(configuration);
  const handleOpenAffected = () => openAffectedModal(configuration);
  const handleGoTo = () => navigate(`/configuration/${configuration.id}`);

  return (
    <Flex>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton
                colorScheme="red"
                icon={<Trash size={20} />}
                size="sm"
                isDisabled={configuration.inUse.length > 0}
              />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {configuration.name}
          </PopoverHeader>
          <PopoverBody px={0}>
            {t('crud.delete_confirm', { obj: t('configurations.one') })}
          </PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button
                colorScheme="red"
                ml="1"
                onClick={handleDeleteClick}
                isLoading={deleteConfig.isLoading}
              >
                Yes
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <Tooltip hasArrow label={t('configurations.view_in_use')} placement="top">
        <IconButton
          ml={2}
          colorScheme="blue"
          icon={<ListDashes size={20} />}
          size="sm"
          onClick={handleOpenInUse}
        />
      </Tooltip>
      <Tooltip hasArrow label={t('configurations.view_affected_devices')} placement="top">
        <IconButton
          ml={2}
          colorScheme="blue"
          icon={<ListChecks size={20} />}
          size="sm"
          onClick={handleOpenAffected}
        />
      </Tooltip>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          ml={2}
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          size="sm"
          onClick={handleGoTo}
        />
      </Tooltip>
    </Flex>
  );
};

Actions.propTypes = propTypes;

export default Actions;
