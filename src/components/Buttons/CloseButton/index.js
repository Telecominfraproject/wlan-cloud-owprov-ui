import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { X } from 'phosphor-react';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

const defaultProps = {
  isDisabled: false,
  isLoading: false,
};

const CloseButton = ({ onClick, isDisabled, isLoading, ...props }) => {
  const { t } = useTranslation();

  return (
    <Tooltip label={t('common.close')}>
      <IconButton
        colorScheme="gray"
        onClick={onClick}
        icon={<X size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        {...props}
      />
    </Tooltip>
  );
};

CloseButton.propTypes = propTypes;
CloseButton.defaultProps = defaultProps;

export default CloseButton;
