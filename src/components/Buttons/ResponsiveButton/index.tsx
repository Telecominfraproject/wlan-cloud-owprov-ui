import React, { ReactElement } from 'react';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';

interface Props {
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
  color: string;
  label: string;
  ml?: string | number;
  icon?: ReactElement;
}

const defaultProps = {
  isDisabled: false,
  isLoading: false,
  isCompact: false,
  ml: undefined,
  icon: undefined,
};

const ResponsiveButton: React.FC<Props> = ({ onClick, isDisabled, isLoading, isCompact, color, label, ml, icon }) => {
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme={color}
        type="button"
        onClick={onClick}
        rightIcon={icon}
        isLoading={isLoading}
        isDisabled={isDisabled}
        ml={ml}
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
        icon={icon}
        isLoading={isLoading}
        isDisabled={isDisabled}
        ml={ml}
      />
    </Tooltip>
  );
};

ResponsiveButton.defaultProps = defaultProps;

export default React.memo(ResponsiveButton);
