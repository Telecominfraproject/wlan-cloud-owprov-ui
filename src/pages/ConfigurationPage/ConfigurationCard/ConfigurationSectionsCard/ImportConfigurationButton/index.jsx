import React from 'react';
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { UploadSimple } from '@phosphor-icons/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ImportConfigurationModal from './Modal';

const propTypes = {
  setConfig: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

const ImportConfigurationButton = ({ setConfig, isDisabled }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label={t('configurations.import_file')}>
        <IconButton
          ml={2}
          colorScheme="blue"
          onClick={onOpen}
          icon={<UploadSimple size={20} />}
          isDisabled={isDisabled}
        />
      </Tooltip>
      <ImportConfigurationModal isOpen={isOpen} onClose={onClose} setValue={setConfig} />
    </>
  );
};

ImportConfigurationButton.propTypes = propTypes;
export default React.memo(ImportConfigurationButton);
