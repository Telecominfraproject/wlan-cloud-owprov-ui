import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint, LayoutProps, SpaceProps } from '@chakra-ui/react';
import { Plus } from 'phosphor-react';

interface Props extends LayoutProps, SpaceProps {
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
  label?: string;
}

const defaultProps = {
  onClick: () => {},
  isDisabled: false,
  isLoading: false,
  isCompact: false,
  label: undefined,
};

const CreateButton: React.FC<Props> = ({ onClick, isDisabled, isLoading, isCompact, label, ...props }) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="blue"
        type="button"
        onClick={onClick}
        rightIcon={<Plus size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      >
        {label ?? t('common.create')}
      </Button>
    );
  }
  return (
    <Tooltip label={label ?? t('common.create')}>
      <IconButton
        aria-label="Create"
        colorScheme="blue"
        type="button"
        onClick={onClick}
        icon={<Plus size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      />
    </Tooltip>
  );
};

CreateButton.defaultProps = defaultProps;

export default React.memo(CreateButton);
