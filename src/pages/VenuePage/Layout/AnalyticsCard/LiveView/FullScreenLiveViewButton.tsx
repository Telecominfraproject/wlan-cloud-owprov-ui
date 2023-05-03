import React from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { ArrowsIn, ArrowsOut } from '@phosphor-icons/react';
import { FullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';

type Props = {
  isDisabled: boolean;
  handle: FullScreenHandle;
};

const FullScreenLiveViewButton = ({ isDisabled, handle }: Props) => {
  const { t } = useTranslation();

  const handleClick = () => (handle.active ? handle.exit() : handle.enter());
  const icon = () => (handle.active ? <ArrowsIn size={20} /> : <ArrowsOut size={20} />);

  return (
    <Tooltip label={handle.active ? t('common.exit_fullscreen') : t('common.fullscreen')}>
      <IconButton
        aria-label={handle.active ? t('common.exit_fullscreen') : t('common.fullscreen')}
        type="button"
        onClick={handleClick}
        icon={icon()}
        isDisabled={isDisabled}
        colorScheme="teal"
        mr={2}
      />
    </Tooltip>
  );
};

export default FullScreenLiveViewButton;
