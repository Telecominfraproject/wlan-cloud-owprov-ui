import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { ArrowsClockwise } from 'phosphor-react';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isFetching: PropTypes.bool,
  isCompact: PropTypes.bool,
};

const defaultProps = {
  isDisabled: false,
  isFetching: false,
  isCompact: false,
};

const RefreshButton = ({ onClick, isDisabled, isFetching, isCompact, ...props }) => {
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
        {...props}
      >
        {t('common.refresh')}
      </Button>
    );
  }

  return (
    <Tooltip label={t('common.refresh')}>
      <IconButton
        colorScheme="gray"
        onClick={onClick}
        icon={<ArrowsClockwise size={20} />}
        isDisabled={isDisabled}
        isLoading={isFetching}
        {...props}
      />
    </Tooltip>
  );
};

RefreshButton.propTypes = propTypes;
RefreshButton.defaultProps = defaultProps;

export default RefreshButton;
