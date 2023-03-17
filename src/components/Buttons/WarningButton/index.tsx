import React from 'react';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { Warning } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { ThemeProps } from 'models/Theme';

interface Props extends ThemeProps {
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
  label?: string;
}

const defaultProps = {
  isDisabled: false,
  isLoading: false,
  isCompact: true,
  label: undefined,
};

const WarningButton = ({ onClick, isDisabled, isLoading, isCompact, label, ...props }: Props) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="yellow"
        type="button"
        onClick={onClick}
        rightIcon={<Warning size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      >
        {label ?? t('common.alert')}
      </Button>
    );
  }
  return (
    <Tooltip label={label ?? t('common.alert')}>
      <IconButton
        aria-label="alert-button"
        colorScheme="yellow"
        type="button"
        onClick={onClick}
        icon={<Warning size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      />
    </Tooltip>
  );
};

WarningButton.defaultProps = defaultProps;

export default WarningButton;
