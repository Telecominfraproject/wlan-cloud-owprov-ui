import React from 'react';
import { Button, IconButton, Tooltip, useBreakpoint, useDisclosure } from '@chakra-ui/react';
import { Pencil, X } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';

interface Props {
  toggleEdit: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
  isEditing: boolean;
  isDirty?: boolean;
  ml?: string | number;
}

const defaultProps = {
  isDisabled: false,
  isLoading: false,
  isCompact: true,
  isDirty: false,
  ml: undefined,
};

const ToggleEditButton = ({
  toggleEdit,
  isEditing,
  isDirty,
  isDisabled,
  isLoading,
  isCompact,
  ml,
  ...props
}: Props) => {
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
          ml={ml}
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
          aria-label="toggle-edit"
          colorScheme="gray"
          type="button"
          onClick={toggle}
          icon={isEditing ? <X size={20} /> : <Pencil size={20} />}
          isLoading={isLoading}
          isDisabled={isDisabled}
          ml={ml}
          {...props}
        />
      </Tooltip>
      <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </>
  );
};

ToggleEditButton.defaultProps = defaultProps;

export default ToggleEditButton;
