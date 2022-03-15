import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Button, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { Pen } from 'phosphor-react';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isCompact: PropTypes.bool,
};

const defaultProps = {
  label: 'Edit',
  isDisabled: false,
  isLoading: false,
  isCompact: false,
};

const EditButton = ({ onClick, label, isDisabled, isLoading, isCompact, ...props }) => {
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="gray"
        onClick={onClick}
        rightIcon={<Pen size={20} />}
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
        colorScheme="gray"
        onClick={onClick}
        icon={<Pen size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      />
    </Tooltip>
  );
};

EditButton.propTypes = propTypes;
EditButton.defaultProps = defaultProps;

export default EditButton;
