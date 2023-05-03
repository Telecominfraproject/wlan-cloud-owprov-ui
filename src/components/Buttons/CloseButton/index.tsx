import React from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface Props {
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  ml?: string | number;
}

const defaultProps = {
  isDisabled: false,
  isLoading: false,
  ml: undefined,
};

const CloseButton = ({ onClick, isDisabled, isLoading, ml, ...props }: Props) => {
  const { t } = useTranslation();

  return (
    <Tooltip label={t('common.close')}>
      <IconButton
        aria-label="close"
        colorScheme="gray"
        onClick={onClick}
        icon={<X size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        ml={ml}
        {...props}
      />
    </Tooltip>
  );
};

CloseButton.defaultProps = defaultProps;

export default CloseButton;
