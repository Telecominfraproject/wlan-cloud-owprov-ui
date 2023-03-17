import React from 'react';
import { Button, IconButton, LayoutProps, SpaceProps, Tooltip, useBreakpoint } from '@chakra-ui/react';

interface ResponsiveButtonProps extends LayoutProps, SpaceProps {
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
  color: string;
  label: string;
  icon?: React.ReactElement;
}

const ResponsiveButton = ({
  onClick,
  isDisabled,
  isLoading,
  isCompact = true,
  color,
  label,
  icon,
  ...props
}: ResponsiveButtonProps) => {
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme={color}
        type="button"
        onClick={onClick}
        // @ts-ignore
        rightIcon={icon}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      >
        {label}
      </Button>
    );
  }
  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={label}
        colorScheme={color}
        type="button"
        onClick={onClick}
        // @ts-ignore
        icon={icon}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      />
    </Tooltip>
  );
};

export default React.memo(ResponsiveButton);
