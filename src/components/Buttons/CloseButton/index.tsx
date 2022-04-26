import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { X } from 'phosphor-react';

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

const CloseButton: React.FC<Props> = ({ onClick, isDisabled, isLoading, ml, ...props }) => {
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
