import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { Trash } from 'phosphor-react';

interface Props {
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
  label?: string;
  ml?: string | number;
}

const defaultProps = {
  isDisabled: false,
  isLoading: false,
  isCompact: false,
  label: undefined,
  ml: undefined,
};

const DeleteButton: React.FC<Props> = ({ onClick, isDisabled, isLoading, isCompact, label, ml, ...props }) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        type="button"
        colorScheme="red"
        onClick={onClick}
        rightIcon={<Trash size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        ml={ml}
        {...props}
      >
        {label ?? t('crud.delete')}
      </Button>
    );
  }

  return (
    <Tooltip label={label ?? t('crud.delete')}>
      <IconButton
        colorScheme="red"
        aria-label="delete"
        type="button"
        onClick={onClick}
        icon={<Trash size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        ml={ml}
        {...props}
      />
    </Tooltip>
  );
};

DeleteButton.defaultProps = defaultProps;
export default React.memo(DeleteButton);
