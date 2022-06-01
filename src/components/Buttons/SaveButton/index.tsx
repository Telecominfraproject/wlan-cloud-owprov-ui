import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { FloppyDisk } from 'phosphor-react';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
  isDirty?: boolean;
  dirtyCheck?: boolean;
  ml?: string | number;
}

const defaultProps = {
  isDisabled: false,
  isLoading: false,
  isCompact: true,
  isDirty: false,
  dirtyCheck: false,
  ml: undefined,
};

const SaveButton: React.FC<Props> = ({ onClick, isDisabled, isLoading, isCompact, isDirty, dirtyCheck, ...props }) => {
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
        aria-label="save"
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

SaveButton.defaultProps = defaultProps;

export default SaveButton;
