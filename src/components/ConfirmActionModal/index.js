import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  action: PropTypes.instanceOf(Object).isRequired,
  cancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  explanation: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

const ConfirmActionModal = ({ isOpen, action, cancel, title, explanation, children }) => {
  const { t } = useTranslation();
  const cancelRef = useRef();

  const handleClick = () => action.mutateAsync();

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={cancel} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogBody>
            <Alert colorScheme="red">{explanation}</Alert>
            {children}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={cancel} mr={4}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleClick} isLoading={action.isLoading} colorScheme="red">
              {t('common.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

ConfirmActionModal.propTypes = propTypes;
ConfirmActionModal.defaultProps = defaultProps;

export default ConfirmActionModal;
