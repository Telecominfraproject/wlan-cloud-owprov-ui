import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { TextAlignCenter } from 'phosphor-react';

const propTypes = {
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
};

const defaultProps = {
  onClick: () => {},
  isDisabled: false,
};

const AutoAlignButton = ({ onClick, isDisabled, ...props }) => {
  const { t } = useTranslation();

  return (
    <Tooltip label={t('map.auto_align')}>
      <IconButton
        colorScheme="gray"
        onClick={onClick}
        icon={<TextAlignCenter size={20} />}
        isDisabled={isDisabled}
        {...props}
      />
    </Tooltip>
  );
};

AutoAlignButton.propTypes = propTypes;
AutoAlignButton.defaultProps = defaultProps;

export default AutoAlignButton;
