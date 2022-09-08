import React from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { ArrowsIn, ArrowsOut } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

const propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  handle: PropTypes.shape({
    enter: PropTypes.func.isRequired,
    exit: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
  }).isRequired,
};

const CirclePackExpandButton = ({ isDisabled, handle }) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  const handleClick = () => (handle.active ? handle.exit() : handle.enter());
  const icon = () => (handle.active ? <ArrowsIn size={20} /> : <ArrowsOut size={20} />);

  if (breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button colorScheme="blue" type="button" onClick={handleClick} rightIcon={icon()} isDisabled={isDisabled} mr={2}>
        {handle.active ? t('common.exit_fullscreen') : t('common.fullscreen')}
      </Button>
    );
  }
  return (
    <Tooltip label={handle.active ? t('common.exit_fullscreen') : t('common.fullscreen')}>
      <IconButton colorScheme="blue" type="button" onClick={handleClick} icon={icon()} isDisabled={isDisabled} mr={2} />
    </Tooltip>
  );
};

CirclePackExpandButton.propTypes = propTypes;
export default React.memo(CirclePackExpandButton);
