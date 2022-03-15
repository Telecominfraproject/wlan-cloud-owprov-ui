import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { Trash } from 'phosphor-react';

const propTypes = {
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isCompact: PropTypes.bool,
  label: PropTypes.string,
};

const defaultProps = {
  onClick: () => {},
  isDisabled: false,
  isLoading: false,
  isCompact: false,
  label: null,
};

const DeleteButton = ({ onClick, isDisabled, isLoading, isCompact, label, ...props }) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="red"
        type="button"
        onClick={onClick}
        rightIcon={<Trash size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
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
        type="button"
        onClick={onClick}
        icon={<Trash size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      />
    </Tooltip>
  );
};

DeleteButton.propTypes = propTypes;
DeleteButton.defaultProps = defaultProps;

export default DeleteButton;
