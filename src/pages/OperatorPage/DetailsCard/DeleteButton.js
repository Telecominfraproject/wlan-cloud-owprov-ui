import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DeleteButton from 'components/Buttons/DeleteButton';
import { EntityShape } from 'constants/propShapes';
import { useNavigate } from 'react-router-dom';
import useMutationResult from 'hooks/useMutationResult';
import { useDeleteOperator } from 'hooks/Network/Operators';
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

const propTypes = {
  operator: PropTypes.shape(EntityShape),
  isDisabled: PropTypes.bool,
};

const defaultProps = {
  operator: { name: '', id: '', defaultOperator: false },
  isDisabled: false,
};

const DeleteOperatorButton = ({ operator, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { onSuccess, onError } = useMutationResult({
    objName: t('operator.one'),
    refresh: () => navigate('/operators'),
    operationType: 'delete',
  });
  const deleteOperator = useDeleteOperator({ id: operator.id });

  const handleDeleteClick = () =>
    deleteOperator.mutateAsync(
      {},
      {
        onSuccess: () => onSuccess(),
        onError: (e) => onError(e),
      },
    );

  return (
    <>
      <DeleteButton isDisabled={isDisabled} onClick={onOpen} ml={2} />
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{t('operator.delete_operator')}</AlertDialogHeader>
            <AlertDialogBody>
              <Alert colorScheme="red">{t('operator.delete_explanation')}</Alert>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose} mr={4}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleDeleteClick} isLoading={deleteOperator.isLoading} colorScheme="red">
                {t('common.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

DeleteOperatorButton.propTypes = propTypes;
DeleteOperatorButton.defaultProps = defaultProps;
export default DeleteOperatorButton;
