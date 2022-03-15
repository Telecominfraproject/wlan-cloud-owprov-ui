import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { FloppyDisk } from 'phosphor-react';

const propTypes = {
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isCompact: PropTypes.bool,
  isDirty: PropTypes.bool,
  dirtyCheck: PropTypes.bool,
};

const defaultProps = {
  onClick: () => {},
  isDisabled: false,
  isLoading: false,
  isCompact: true,
  isDirty: false,
  dirtyCheck: false,
};

const SaveButton = ({
  onClick,
  isDisabled,
  isLoading,
  isCompact,
  isDirty,
  dirtyCheck,
  ...props
}) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="blue"
        type="submit"
        onClick={onClick}
        rightIcon={<FloppyDisk size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled || (dirtyCheck && !isDirty)}
        {...props}
      >
        {t('common.save')}
      </Button>
    );
  }
  return (
    <Tooltip label={t('common.save')}>
      <IconButton
        colorScheme="blue"
        type="submit"
        onClick={onClick}
        icon={<FloppyDisk size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled || (dirtyCheck && !isDirty)}
        {...props}
      />
    </Tooltip>
  );
};

SaveButton.propTypes = propTypes;
SaveButton.defaultProps = defaultProps;

export default SaveButton;
