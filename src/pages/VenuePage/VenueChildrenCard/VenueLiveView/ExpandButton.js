import React from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { ArrowsOut } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

const propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  handle: PropTypes.shape({
    enter: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
  }).isRequired,
};

const CirclePackExpandButton = ({ isDisabled, handle }) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  if (breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="blue"
        type="button"
        onClick={handle.enter}
        rightIcon={<ArrowsOut size={20} />}
        isDisabled={isDisabled}
        mr={2}
      >
        {t('common.fullscreen')}
      </Button>
    );
  }
  return (
    <Tooltip label={t('common.fullscreen')}>
      <IconButton
        colorScheme="blue"
        type="button"
        onClick={handle.enter}
        icon={<ArrowsOut size={20} />}
        isDisabled={isDisabled}
        mr={2}
      />
    </Tooltip>
  );
};

CirclePackExpandButton.propTypes = propTypes;
export default React.memo(CirclePackExpandButton);
