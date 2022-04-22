import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { ArrowRight, FloppyDisk } from 'phosphor-react';

interface Props {
  onNext: () => void;
  onSave?: () => void;
  currentStep: number;
  lastStep: number;
  isDisabled?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
  ml?: string | number;
}

const defaultProps = {
  onSave: undefined,
  isDisabled: false,
  isLoading: false,
  isCompact: false,
  ml: undefined,
};

const StepButton: React.FC<Props> = ({
  onNext,
  onSave,
  isDisabled,
  isLoading,
  isCompact,
  currentStep,
  lastStep,
  ml,
  ...props
}) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  const onClick = useCallback(
    () => (currentStep === lastStep && onSave ? onSave() : onNext()),
    [currentStep, lastStep, onNext, onSave],
  );
  const icon = useMemo(
    () => (currentStep === lastStep ? <FloppyDisk size={20} /> : <ArrowRight size={20} />),
    [currentStep, lastStep],
  );
  const label = useMemo(
    () => (currentStep === lastStep ? t('common.save') : t('common.next')),
    [currentStep, lastStep],
  );

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        type="button"
        colorScheme="blue"
        onClick={onClick}
        rightIcon={icon}
        isLoading={isLoading}
        isDisabled={isDisabled}
        ml={ml}
        {...props}
      >
        {label}
      </Button>
    );
  }

  return (
    <Tooltip label={label}>
      <IconButton
        colorScheme="blue"
        aria-label="next"
        type="button"
        onClick={onClick}
        icon={icon}
        isLoading={isLoading}
        isDisabled={isDisabled}
        ml={ml}
        {...props}
      />
    </Tooltip>
  );
};

StepButton.defaultProps = defaultProps;
export default StepButton;
