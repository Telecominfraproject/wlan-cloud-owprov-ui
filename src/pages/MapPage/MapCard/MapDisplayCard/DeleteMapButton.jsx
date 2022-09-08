import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { Trash } from 'phosphor-react';

const propTypes = {
  deleteMap: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

const defaultProps = {
  isDisabled: false,
};

const DeleteMapButton = ({ deleteMap, isDisabled, ...props }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    deleteMap();
    onClose();
  };

  return (
    <>
      <Tooltip label={t('crud.delete')}>
        <IconButton colorScheme="red" onClick={onOpen} icon={<Trash size={20} />} isDisabled={isDisabled} {...props} />
      </Tooltip>
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{t('crud.delete_obj', { obj: t('map.title') })}</AlertDialogHeader>
            <AlertDialogBody>
              <Alert colorScheme="red">{t('map.delete_warning')}</Alert>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose} mr={4}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleDelete} colorScheme="red">
                {t('common.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

DeleteMapButton.propTypes = propTypes;
DeleteMapButton.defaultProps = defaultProps;

export default DeleteMapButton;
