import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { Plus } from 'phosphor-react';

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

const CreateButton = ({ onClick, isDisabled, isLoading, isCompact, label, ...props }) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="blue"
        type="submit"
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
        colorScheme="blue"
        type="submit"
        onClick={onClick}
        icon={<Plus size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      />
    </Tooltip>
  );
};

CreateButton.propTypes = propTypes;
CreateButton.defaultProps = defaultProps;

export default CreateButton;
