import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint, useDisclosure } from '@chakra-ui/react';
import { Pencil, X } from 'phosphor-react';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';

const propTypes = {
  toggleEdit: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isCompact: PropTypes.bool,
  isDirty: PropTypes.bool,
  isEditing: PropTypes.bool.isRequired,
};

const defaultProps = {
  isDisabled: false,
  isLoading: false,
  isCompact: false,
  isDirty: false,
};

const ToggleEditButton = ({ toggleEdit, isEditing, isDirty, isDisabled, isLoading, isCompact, ...props }) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();

  const toggle = () => {
    if (isEditing && isDirty) {
      openConfirm();
    } else {
      toggleEdit();
    }
  };

  const closeCancelAndForm = () => {
    closeConfirm();
    toggleEdit();
  };

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <>
        <Button
          colorScheme="gray"
          type="button"
          onClick={toggle}
          rightIcon={isEditing ? <X size={20} /> : <Pencil size={20} />}
          isLoading={isLoading}
          isDisabled={isDisabled}
          {...props}
        >
          {isEditing ? t('common.stop_editing') : t('common.edit')}
        </Button>
        <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
      </>
    );
  }
  return (
    <>
      <Tooltip label={isEditing ? t('common.stop_editing') : t('common.edit')}>
        <IconButton
          colorScheme="gray"
          type="button"
          onClick={toggle}
          icon={isEditing ? <X size={20} /> : <Pencil size={20} />}
          isLoading={isLoading}
          isDisabled={isDisabled}
          {...props}
        />
      </Tooltip>
      <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </>
  );
};

ToggleEditButton.propTypes = propTypes;
ToggleEditButton.defaultProps = defaultProps;

export default ToggleEditButton;
