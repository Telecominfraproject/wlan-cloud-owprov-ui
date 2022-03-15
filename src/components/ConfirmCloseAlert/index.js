import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
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
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

const ConfirmCloseAlert = ({ isOpen, confirm, cancel }) => {
  const { t } = useTranslation();
  const cancelRef = useRef();

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{t('common.discard_changes')}</AlertDialogHeader>
          <AlertDialogBody>{t('crud.confirm_cancel')}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={cancel} mr={4}>
              {t('common.cancel')}
            </Button>
            <Button onClick={confirm} colorScheme="red">
              {t('common.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

ConfirmCloseAlert.propTypes = propTypes;

export default ConfirmCloseAlert;
