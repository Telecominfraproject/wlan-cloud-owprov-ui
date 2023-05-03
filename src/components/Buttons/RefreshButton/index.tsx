import React from 'react';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface Props {
  onClick: () => void;
  isDisabled?: boolean;
  isFetching?: boolean;
  isCompact?: boolean;
  ml?: string | number;
}

const defaultProps = {
  isDisabled: false,
  isFetching: false,
  isCompact: true,
  ml: undefined,
};

const RefreshButton = ({ onClick, isDisabled, isFetching, isCompact, ml, ...props }: Props) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        minWidth="112px"
        colorScheme="gray"
        onClick={onClick}
        rightIcon={<ArrowsClockwise size={20} />}
        isDisabled={isDisabled}
        isLoading={isFetching}
        ml={ml}
        {...props}
      >
        {t('common.refresh')}
      </Button>
    );
  }

  return (
    <Tooltip label={t('common.refresh')}>
      <IconButton
        aria-label="refresh"
        colorScheme="gray"
        onClick={onClick}
        icon={<ArrowsClockwise size={20} />}
        isDisabled={isDisabled}
        isLoading={isFetching}
        ml={ml}
        {...props}
      />
    </Tooltip>
  );
};

RefreshButton.defaultProps = defaultProps;

export default RefreshButton;
